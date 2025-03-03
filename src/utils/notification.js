import { getDatabase, ref, push, set } from "firebase/database";
import { db } from "@/hooks/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

async function sendNotification({
  recipientId,
  senderId,
  senderName,
  senderPhotoURL,
  eventTitle,
  eventTimestamp,
  location,
  type,
  message,
}) {
  if (!recipientId || !senderId || !eventTitle || !type) {
    console.error("Missing required fields for notification.");
    return;
  }

  try {
    await addDoc(collection(db, "notifications"), {
      recipientId,
      senderId,
      senderName,
      senderPhotoURL,
      eventTitle,
      eventTimestamp,
      location,
      createdAt: serverTimestamp(),
      read: false,
      type,
      message,
    });

    console.log(`Notification sent: ${type} to ${recipientId}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

export async function handleUserInterested(activity, currentUser) {
  if (!activity || !currentUser) return;

  console.log("User expressed interest:", {
    recipientId: activity.posterUid,
    senderId: currentUser.uid,
    eventTitle: activity.title,
    eventTimestamp: activity.eventTimestamp,
    location: activity.location,
  });
  const db = getDatabase();
  const interestedRef = ref(
    db,
    `users/${activity.posterUid}/activities/${activity.id}/interested/${currentUser.uid}`,
  );

  await set(interestedRef, {
    userId: currentUser.uid,
    timestamp: Date.now(),
  });

  console.log("User added to interested list under the host's activity.");

  await sendNotification({
    recipientId: activity.posterUid,
    senderId: currentUser.uid,
    senderName: currentUser.displayName,
    senderPhotoURL: currentUser.photoURL,
    eventTitle: activity.title,
    eventTimestamp: activity.eventTimestamp,
    location: activity.location,
    type: "INTERESTED",
    message: `${currentUser.displayName} is interested in ${activity.title}.`,
  });
}

export async function handleAcceptInterest(notification) {
  if (!notification || !notification.senderId || !notification.recipientId)
    return;

  console.log("Interest accepted:", {
    recipientId: notification.senderId,
    senderId: notification.recipientId,
    eventTitle: notification.eventTitle,
    eventTimestamp: notification.eventTimestamp,
    location: notification.location,
  });

  const { google, ics } = generateCalendarLinks(
    notification.eventTitle,
    notification.eventTimestamp,
    notification.location,
  );

  const db = getDatabase();
  const interestedRef = ref(
    db,
    `users/${notification.recipientId}/activities/${notification.eventId}/interested/${notification.senderId}`,
  );
  const approvedRef = ref(
    db,
    `users/${notification.recipientId}/activities/${notification.eventId}/approved/${notification.senderId}`,
  );

  // Move user to approved and remove from interested
  await set(approvedRef, {
    userId: notification.senderId,
    timestamp: Date.now(),
  });

  await set(interestedRef, null); // Delete from interested
  console.log(
    "User moved from interested to approved under the host's activity.",
  );

  await sendNotification({
    recipientId: notification.senderId,
    senderId: notification.recipientId,
    senderName: "Event Organizer",
    senderPhotoURL: "",
    eventTitle: notification.eventTitle,
    eventTimestamp: notification.eventTimestamp,
    location: notification.location,
    type: "ACCEPTED",
    message: `Your interest in ${notification.eventTitle} has been accepted! <br>
            <div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
              <a href="${google}" target="_blank"
                 style="color: #007bff; text-decoration: none; font-size: 13px; font-weight: 500;">
                Add to Google Calendar
              </a>
              <span style="color: #888; font-size: 13px;">|</span>
              <a href="${ics}" download="event.ics"
                 style="color: #007bff; text-decoration: none; font-size: 13px; font-weight: 500;">
                Download Calendar Event
              </a>
            </div>`,
  });
}
