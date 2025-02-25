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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser] = useAuthState();

  useEffect(() => {
    if (!currentUser) return;

    // Only fetch notifications where recipientId is the current user
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
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
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
