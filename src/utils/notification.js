import { getDatabase, ref, set } from "firebase/database";

export function generateCalendarLinks(
  eventTitle,
  eventStartTimestamp,
  eventEndTimestamp,
  eventLocation = "",
) {
  if (
    !eventStartTimestamp.endsWith("Z") &&
    !eventStartTimestamp.includes("+")
  ) {
    eventStartTimestamp += "Z"; // Ensure UTC format
  }
  if (!eventEndTimestamp.endsWith("Z") && !eventEndTimestamp.includes("+")) {
    eventEndTimestamp += "Z"; // Ensure UTC format
  }
  const startTime = new Date(eventStartTimestamp)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
  const endTime = new Date(eventEndTimestamp)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");

  const encodedTitle = encodeURIComponent(eventTitle);
  const encodedLocation = encodeURIComponent(eventLocation);
  const eventDetails = encodeURIComponent(
    "You have been accepted for this event!",
  );

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startTime}/${endTime}&details=${eventDetails}&location=${encodedLocation}`,
    ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodedTitle}%0ADESCRIPTION:${eventDetails}%0ALOCATION:${encodedLocation}%0ADTSTART:${startTime}%0ADTEND:${endTime}%0AEND:VEVENT%0AEND:VCALENDAR`,
  };
}

// User expresses interest in an activity
export async function handleUserInterested(activity, currentUser) {
  if (!activity || !currentUser) return;

  console.log("User expressed interest:", {
    recipientId: activity.posterUid,
    senderId: currentUser.uid,
    eventTitle: activity.title,
    eventStartTimestamp: activity.eventStartTimestamp,
    eventEndTimestamp: activity.eventEndTimestamp,
    location: activity.location,
    eventId: activity.id,
  });

  const db = getDatabase();
  const interestedRef = ref(
    db,
    `users/${activity.posterUid}/hosted_activities/${activity.id}/interested/${currentUser.uid}`,
  );

  await set(interestedRef, {
    userId: currentUser.uid,
    timestamp: Date.now(),
  });

  console.log("User added to interested list under the host's activity.");
}

export async function handleAcceptInterest(
  hostId,
  activityId,
  userId,
  eventTitle,
  eventStartTimestamp,
  eventEndTimestamp,
  location,
) {
  if (!hostId || !activityId || !userId) {
    console.error("Missing required parameters!");
    return;
  }

  console.log("Interest accepted:", {
    recipientId: userId,
    senderId: hostId,
    eventTitle,
    eventStartTimestamp,
    eventEndTimestamp,
    location,
    eventId: activityId,
  });

  try {
    const formattedStartTimestamp = new Date(eventStartTimestamp).toISOString(); // Convert number to string
    const formattedEndTimestamp = new Date(eventEndTimestamp).toISOString(); // Convert number to string
    const { google, ics } = generateCalendarLinks(
      eventTitle,
      formattedStartTimestamp,
      formattedEndTimestamp,
      location,
    );
    const db = getDatabase();

    const interestedRef = ref(
      db,
      `users/${hostId}/hosted_activities/${activityId}/interested/${userId}`,
    );
    const approvedRef = ref(
      db,
      `users/${hostId}/hosted_activities/${activityId}/approved/${userId}`,
    );
    const participatingRef = ref(
      db,
      `users/${userId}/participating_activities/${activityId}`,
    );

    await set(approvedRef, { userId, timestamp: Date.now() });
    await set(participatingRef, {
      hostingUserId: hostId,
      activityId,
      eventTitle,
      eventStartTimestamp,
      eventEndTimestamp,
      location,
      timestamp: Date.now(),
    });
    await set(interestedRef, null); // Remove from interested list

    console.log("User moved from interested to approved.");
  } catch (error) {
    console.error("Firebase Error:", error);
    alert("Error processing interest. Check console for details.");
  }
}
