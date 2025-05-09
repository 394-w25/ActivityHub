import { handleAcceptInterest } from "@/utils/notification";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export function NotificationCard({ notification }) {
  const navigate = useNavigate();
  const { type, message } = notification;

  let timeAgo = "Just now";
  if (notification.timestamp) {
    const timestamp =
      typeof notification.timestamp === "number"
        ? notification.timestamp
        : notification.timestamp?.seconds * 1000; // Handle Firestore and regular timestamps
    timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }

  const displayMessage = message
    ? message.replace(/^(Event Organizer|.*?):\s*/, "")
    : "No message available.";

  const handleViewProfile = () => {
    if (!notification.userId) {
      console.error("No senderId, cannot navigate to profile.");
      alert("User profile unavailable.");
      return;
    }
    navigate(`/user_profile/${notification.userId}`);
  };

  const [acceptBtn, setAcceptBtn] = useState(false);

  return (
    <div className="bg-white px-4 py-3 mb-3 max-w-md w-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage
              src={notification.profilePhoto || "/default-avatar.png"}
              alt="User Profile"
            />

            <AvatarFallback>{notification.message.charAt(0)}</AvatarFallback>
          </Avatar>

          <p
            className="text-sm text-gray-900"
            dangerouslySetInnerHTML={{ __html: displayMessage }}
          ></p>
        </div>

        <p className="text-[10px] text-gray-400 ml-2 shrink-0 whitespace-nowrap self-start">
          {timeAgo}
        </p>
      </div>

      {type === "INTEREST_REQUEST" && (
        <div className="flex space-x-2 mt-2 ml-16">
          <Button
            className="px-4 py-1 cursor-pointer text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 shadow-none"
            onClick={handleViewProfile}
            style={{ fontFamily: "Georgia, serif" }}
          >
            View Profile
          </Button>
          <Button
            disabled={acceptBtn}
            className="px-4 py-1 bg-[#f07b3c] text-white hover:bg-[#ed6115] cursor-pointer border-none shadow-none"
            onClick={() => {
              console.log("Debugging Accept Click: ", notification);

              const hostId =
                notification.posterUid ||
                notification.hostingUserId ||
                "MISSING_HOST_ID";

              handleAcceptInterest(
                hostId,
                notification.eventId ?? "MISSING_EVENT_ID",
                notification.userId ?? "MISSING_USER_ID",
                notification.eventTitle ?? "MISSING_TITLE",
                notification.eventStartTimestamp
                  ? new Date(notification.eventStartTimestamp).toISOString()
                  : new Date().toISOString(),
                notification.eventEndTimestamp
                  ? new Date(notification.eventEndTimestamp).toISOString()
                  : new Date().toISOString(),
                notification.location ?? "MISSING_LOCATION",
              );
              setAcceptBtn(true);
            }}
          >
            {acceptBtn ? "Accepted" : "Accept"}
          </Button>
        </div>
      )}
    </div>
  );
}
