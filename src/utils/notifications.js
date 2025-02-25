/*
 * notification
 * - recipientId:: String
 * - senderId: String
 * - senderName: String
 * - senderPhotoURL: String
 * - eventTitle: String
 * - Location: String
 * - createdAt: String

 */

import { useDbUpdate, useDbRemove } from "@hooks/firebase";

export function getNotificationsForUser(allData, currentUserId) {
  if (!allData) return [];
  return Object.entries(allData)
    .filter(([_, notifData]) => notifData.recipientId === currentUserId)
    .map(([notifId, notifData]) => ({
      id: notifId,
      ...notifData,
    }));
}

export const removeNotification = (notifId) =>
  useDbRemove(`notifications/${notifId}`);

export const updateNotification = (notifId, notifData) => {
  const [updateNotification] = useDbUpdate(`notifications/${notifId}`);
  updateNotification(notifData);
};
