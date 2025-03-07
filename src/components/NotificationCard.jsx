import { handleAcceptInterest } from "@/utils/notification";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export function NotificationCard({ notification }) {
  const navigate = useNavigate();
  const {
    senderId,
    senderName,
    senderPhotoURL,
    eventTitle,
    createdAt,
    type,
    message,
  } = notification;

  let timeAgo = "Just now";
  if (createdAt?.seconds) {
    timeAgo = formatDistanceToNow(new Date(createdAt.seconds * 1000), {
      addSuffix: true,
    });
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

  return (
    <div className="bg-white px-4 py-3 mb-3 max-w-md w-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={senderPhotoURL} alt={`${senderName}'s profile`} />
            <AvatarFallback>{senderName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <p
            className="text-sm text-gray-900"
            dangerouslySetInnerHTML={{ __html: displayMessage }}
          ></p>
        </div>

        <p className="text-xs text-gray-400 ml-auto">{timeAgo}</p>
      </div>

      {type === "INTEREST_REQUEST" && (
        <div className="flex space-x-2 mt-2 ml-16">
          <Button
            className="px-4 py-1 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 shadow-none"
            onClick={handleViewProfile}
            style={{ fontFamily: "Georgia, serif" }}
          >
            View Profile
          </Button>
          <Button
            className="px-4 py-1 bg-[#f07b3c] text-white hover:bg-[#ed6115] border-none shadow-none"
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
                notification.eventTimestamp
                  ? new Date(notification.eventTimestamp).toISOString()
                  : new Date().toISOString(),
                notification.location ?? "MISSING_LOCATION",
              );
            }}
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
