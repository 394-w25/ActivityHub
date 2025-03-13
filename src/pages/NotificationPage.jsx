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

    const fetchHostedNotifications = new Promise((resolve) => {
      onValue(hostedRef, (snapshot) => {
        if (snapshot.exists()) {
          const hostedActivities = snapshot.val();
          const fetchPromises = Object.entries(hostedActivities).flatMap(
            ([activityId, activity]) => {
              if (activity.interested) {
                return Object.entries(activity.interested).map(
                  ([interestedUserId, details]) => {
                    return new Promise((resolve) => {
                      const userRef = ref(db, `users/${interestedUserId}`);
                      onValue(
                        userRef,
                        (userSnapshot) => {
                          if (userSnapshot.exists()) {
                            const userData = userSnapshot.val();
                            notificationsList.push({
                              type: "INTEREST_REQUEST",
                              message: `${userData.displayName || "A user"} is interested in "${activity.title}".`,
                              eventTitle: activity.title,
                              eventId: activityId,
                              eventTimestamp: activity.eventStartTimestamp,
                              timestamp: details.timestamp,
                              userId: interestedUserId,
                              profilePhoto:
                                userData.photoURL || "/default-avatar.png",
                              posterUid: activity.posterUid,
                              location: activity.location ?? "Unknown Location",
                            });
                          }
                          resolve();
                        },
                        { onlyOnce: true },
                      );
                    });
                  },
                );
              }
              return [];
            },
          );

          Promise.all(fetchPromises).then(resolve);
        } else {
          resolve();
        }
      });
    });

    const fetchParticipatingNotifications = new Promise((resolve) => {
      onValue(participatingRef, (snapshot) => {
        if (snapshot.exists()) {
          const participatingActivities = snapshot.val();
          const fetchPromises = Object.entries(participatingActivities).map(
            ([activityId, details]) => {
              return new Promise((resolve) => {
                const hostRef = ref(db, `users/${details.hostingUserId}`);
                onValue(
                  hostRef,
                  (hostSnapshot) => {
                    const hostData = hostSnapshot.exists()
                      ? hostSnapshot.val()
                      : {};
                    const eventTitle = details.eventTitle || "Unknown Event";
                    const eventStartTimestamp =
                      details.eventStartTimestamp || new Date().toISOString();
                    const eventEndTimestamp =
                      details.eventEndTimestamp || new Date().toISOString();
                    const eventLocation =
                      details.location || "No location provided";
                    const { google, ics } = generateCalendarLinks(
                      eventTitle,
                      eventStartTimestamp,
                      eventEndTimestamp,
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
                      profilePhoto: hostData.photoURL,
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

                    resolve();
                  },
                  { onlyOnce: true },
                );
              });
            },
          );

          Promise.all(fetchPromises).then(resolve);
        } else {
          resolve();
        }
      });
    });

    Promise.all([
      fetchHostedNotifications,
      fetchParticipatingNotifications,
    ]).then(() => {
      setNotifications(
        [...notificationsList]
          .reduce((acc, notification) => {
            if (
              !acc.find(
                (n) =>
                  n.eventId === notification.eventId &&
                  n.userId === notification.userId,
              )
            ) {
              acc.push(notification);
            }
            return acc;
          }, [])
          .sort((a, b) => b.timestamp - a.timestamp), // Sort newest first
      );
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
              key={`${notification.eventId}-${notification.userId}`}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
