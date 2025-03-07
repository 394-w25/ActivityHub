import React, { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { NotificationCard } from "@/components/NotificationCard";
import { useNavigate } from "react-router-dom";
import { generateCalendarLinks } from "@/utils/notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser] = useAuthState();
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const hostedRef = ref(db, `users/${userId}/hosted_activities`);
    const participatingRef = ref(
      db,
      `users/${userId}/participating_activities`,
    );

    const notificationsList = [];

    // Fetch interested users for hosted events (For hosts)
    onValue(hostedRef, (snapshot) => {
      if (snapshot.exists()) {
        const hostedActivities = snapshot.val();
        const notificationsList = [];

        Object.entries(hostedActivities).forEach(([activityId, activity]) => {
          if (activity.interested) {
            Object.entries(activity.interested).forEach(([userId, details]) => {
              const userRef = ref(db, `users/${userId}/displayName`);

              onValue(
                userRef,
                (userSnapshot) => {
                  const displayName = userSnapshot.exists()
                    ? userSnapshot.val()
                    : "A user"; // Default name

                  notificationsList.push({
                    type: "INTEREST_REQUEST",
                    message: `${displayName} is interested in "${activity.title}".`,
                    eventTitle: activity.title,
                    eventId: activityId,
                    eventTimestamp: activity.eventTimestamp,
                    timestamp: details.timestamp, // This is just the notification timestamp
                    userId, // The interested user
                    posterUid: activity.posterUid, // Pass host ID
                    location: activity.location ?? "Unknown Location", // Pass location
                  });

                  setNotifications([...notificationsList].reverse());
                },
                { onlyOnce: true },
              ); // Ensures we fetch the name only once
            });
          }
        });
      }
    });

    // Fetch approved events (For participants)
    onValue(participatingRef, (snapshot) => {
      if (snapshot.exists()) {
        const participatingActivities = snapshot.val();

        Object.entries(participatingActivities).forEach(
          ([activityId, details]) => {
            const hostRef = ref(
              db,
              `users/${details.hostingUserId}/displayName`,
            ); // Fetch host's name

            onValue(
              hostRef,
              (hostSnapshot) => {
                const eventTitle = details.eventTitle || "Unknown Event";
                const eventTimestamp =
                  details.eventTimestamp || new Date().toISOString();
                const eventLocation =
                  details.location || "No location provided";
                const { google, ics } = generateCalendarLinks(
                  eventTitle,
                  eventTimestamp,
                  eventLocation,
                );

                notificationsList.push({
                  id: activityId,
                  type: "APPROVAL",
                  eventTitle,
                  eventId: activityId,
                  timestamp: details.timestamp,
                  userId, // The interested user
                  posterUid: details.hostingUserId, // Pass host ID
                  message: `
  You've been accepted to attend "<strong>${eventTitle}</strong>".<br><br>
  <div style="display: flex; gap: 15px;">
    <a href="${google}" target="_blank" rel="noopener noreferrer" 
       style="color: #3b82f6; text-decoration: none; font-weight: 500;">
       Add to Google Calendar
    </a>
    <a href="${ics}" download="event.ics" 
       style="color: #3b82f6; text-decoration: none; font-weight: 500;">
       Download ICS File
    </a>
  </div>
`,
                });

                setNotifications([...notificationsList].reverse()); // Update state
              },
              { onlyOnce: true },
            ); // we fetch the name only once
          },
        );
      }
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
