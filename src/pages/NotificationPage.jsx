import React, { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { NotificationCard } from "@/components/NotificationCard";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser] = useAuthState();
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const hostedRef = ref(db, `users/${userId}/hosted_activities`);
    const participatingRef = ref(db, `users/${userId}/participatingActivities`);

    const notificationsList = [];

    // 🔹 Fetch interested users for hosted events (For hosts)
    onValue(hostedRef, (snapshot) => {
      if (snapshot.exists()) {
        const hostedActivities = snapshot.val();

        Object.entries(hostedActivities).forEach(([activityId, activity]) => {
          if (activity.interested) {
            Object.entries(activity.interested).forEach(([userId, details]) => {
              notificationsList.push({
                id: `${activityId}_${userId}`,
                type: "INTEREST_REQUEST",
                message: `${userId} is interested in "${activity.title}". Approve or deny?`,
                eventTitle: activity.title,
                eventId: activityId,
                timestamp: details.time,
                userId,
              });
            });
          }
        });
      }
      setNotifications([...notificationsList].reverse()); // Update state
    });

    // 🔹 Fetch approved events (For participants)
    onValue(participatingRef, (snapshot) => {
      if (snapshot.exists()) {
        const participatingActivities = snapshot.val();

        Object.entries(participatingActivities).forEach(
          ([activityId, details]) => {
            notificationsList.push({
              id: activityId,
              type: "APPROVAL",
              message: `You've been accepted to attend "${details.eventTitle}".`,
              eventTitle: details.eventTitle,
              eventId: activityId,
              timestamp: details.timestamp,
              hostingUserId: details.hosting_user_id,
            });
          },
        );
      }
      setNotifications([...notificationsList].reverse()); // Update state
    });
  }, [currentUser, db]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-black text-2xl">
          ←
        </button>
        <h1
          className="flex-grow text-center text-2xl text-black tracking-wide"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Notifications
        </h1>
      </div>

      <div className="w-full max-w-md space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
