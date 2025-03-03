import React, { useEffect, useState } from "react";
import { db } from "@/hooks/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "@/hooks/firebase";
import { NotificationCard } from "./NotificationCard";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser] = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(fetchedNotifications);
    });

    return () => unsubscribe();
  }, [currentUser]);

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
