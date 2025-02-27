import { db } from "@/hooks/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Sends a notification to Firestore.
 * @param {string} recipientId -  user who will receive the notification.
 * @param {string} senderId -  user who triggered the notification.
 * @param {string} senderName - name of the sender.
 * @param {string} senderPhotoURL - profile picture of the sender.
 * @param {string} eventTitle - title of the related event.
 * @param {string} type - type of notification (e.g., "INTERESTED", "ACCEPTED").
 * @param {string} message - custom message for the notification.
 */
async function sendNotification({
  recipientId,
  senderId,
  senderName,
  senderPhotoURL,
  eventTitle,
  eventTimestamp,
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
  });

  await sendNotification({
    recipientId: activity.posterUid,
    senderId: currentUser.uid,
    senderName: currentUser.displayName,
    senderPhotoURL: currentUser.photoURL,
    eventTitle: activity.title,
    eventTimestamp: activity.eventTimestamp,
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
  });

  let eventTimestampStr = notification.eventTimestamp;

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(eventTimestampStr)) {
    eventTimestampStr += ":00";
  }

  if (!eventTimestampStr.endsWith("Z") && !eventTimestampStr.includes("+")) {
    eventTimestampStr += "Z";
  }

  // Create Google Calendar invite URL
  const startTime = new Date(eventTimestampStr)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
  const endTime = new Date(Date.parse(eventTimestampStr) + 3600000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(notification.eventTitle)}&dates=${startTime}/${endTime}&details=You have been accepted for this event!`;

  await sendNotification({
    recipientId: notification.senderId,
    senderId: notification.recipientId,
    senderName: "Event Organizer",
    senderPhotoURL: "",
    eventTitle: notification.eventTitle,
    eventTimestamp: notification.eventTimestamp,
    type: "ACCEPTED",
    message: `Your interest in ${notification.eventTitle} has been accepted! <br><br>
          <strong><a href="${calendarUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
          Add to Google Calendar</a></strong>`,
  });
}
