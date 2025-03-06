import React, { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { NotificationCard } from "./NotificationCard";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser] = useAuthState();
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    if (!currentUser) return;

    const notificationsRef = ref(db, "notifications");

    onValue(notificationsRef, (snapshot) => {
      const allNotifications = snapshot.val();

      if (!allNotifications) {
        setNotifications([]);
        return;
      }

      const userNotifications = Object.values(allNotifications).filter(
        (notif) => notif.recipientId === currentUser.uid,
      );

      setNotifications(userNotifications.reverse());
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
          Notification
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
