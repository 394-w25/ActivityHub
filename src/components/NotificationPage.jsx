import React from "react";
import { useDbData } from "@/hooks/firebase";
import { useAuthState } from "@/hooks/firebase";
import { NotificationCard } from "./NotificationCard";
import { getNotificationsForUser } from "@/utils/notifications";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotificationsPage() {
  const [currentUser] = useAuthState();
  const [notifications, error] = useDbData("/notifications");
  const navigate = useNavigate();

  if (error) return <h1>Error loading notifications: {error.toString()}</h1>;
  if (notifications === undefined) return <h1>Loading notifications...</h1>;
  if (!notifications) return <h1>No notifications found</h1>;

  //   console.log("All notifications:", notifications);
  //   console.log("currentUser.uid:", currentUser.uid);
  const userNotifications = getNotificationsForUser(
    notifications,
    currentUser.uid,
  );
  //   console.log("User notifications:", userNotifications);

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold ml-2">Notifications</h1>
      </div>
      <div className="space-y-4">
        {/* {notifications.map((notification) => ( */}
        {userNotifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
