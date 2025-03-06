import { getDatabase, ref, set } from "firebase/database";

function generateCalendarLinks(eventTitle, eventTimestamp, eventLocation = "") {
  if (!eventTimestamp.endsWith("Z") && !eventTimestamp.includes("+")) {
    eventTimestamp += "Z"; // Ensure UTC format
  }

  const startTime = new Date(eventTimestamp)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
  const endTime = new Date(Date.parse(eventTimestamp) + 3600000) // Default duration: 1 hour
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
    eventTimestamp: activity.eventTimestamp,
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

  console.log("✅ User added to interested list under the host's activity.");
}

// Host accepts a user from the interested list
export async function handleAcceptInterest(
  hostId,
  activityId,
  userId,
  eventTitle,
  eventTimestamp,
  location,
) {
  if (!hostId || !activityId || !userId) return;

  console.log("Interest accepted:", {
    recipientId: userId,
    senderId: hostId,
    eventTitle,
    eventTimestamp,
    location,
    eventId: activityId,
  });

  const { google, ics } = generateCalendarLinks(
    eventTitle,
    eventTimestamp,
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

  // Move user to approved and remove from interested
  await set(approvedRef, {
    userId,
    timestamp: Date.now(),
  });

  await set(participatingRef, {
    hostingUserId: hostId,
    activityId,
    eventTitle,
    eventTimestamp,
    location,
    timestamp: Date.now(),
  });

  await set(interestedRef, null); // Remove from interested list
  console.log(
    "✅ User moved from interested to approved under the host's activity.",
  );
}

// Fetch notifications for the host (interested users)
export function getHostNotifications(hostedActivities) {
  let notifications = [];

  Object.entries(hostedActivities || {}).forEach(([activityId, activity]) => {
    if (activity.interested) {
      Object.entries(activity.interested).forEach(([userId, details]) => {
        notifications.push({
          type: "INTEREST_REQUEST",
          message: `${userId} is interested in "${activity.title}". Approve or deny?`,
          eventTitle: activity.title,
          eventId: activityId,
          timestamp: details.timestamp,
          userId,
        });
      });
    }
  });

  return notifications;
}

// Fetch notifications for participants (approved users)
export function getUserNotifications(participatingActivities) {
  return Object.entries(participatingActivities || {}).map(
    ([activityId, details]) => ({
      type: "APPROVAL",
      message: `You've been accepted to attend "${details.eventTitle}".`,
      eventTitle: details.eventTitle,
      eventId: activityId,
      timestamp: details.timestamp,
      hostingUserId: details.hostingUserId,
    }),
  );
}
