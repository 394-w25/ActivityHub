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
  });

  await sendNotification({
    recipientId: activity.posterUid,
    senderId: currentUser.uid,
    senderName: currentUser.displayName,
    senderPhotoURL: currentUser.photoURL,
    eventTitle: activity.title,
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
  });

  await sendNotification({
    recipientId: notification.senderId,
    senderId: notification.recipientId,
    senderName: "Event Organizer",
    senderPhotoURL: "",
    eventTitle: notification.eventTitle,
    type: "ACCEPTED",
    message: `Your interest in ${notification.eventTitle} has been accepted!`,
  });
}
