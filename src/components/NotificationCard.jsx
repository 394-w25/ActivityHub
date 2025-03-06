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
    if (!senderId) {
      console.error("Sender ID is missing, cannot view profile.");
      return;
    }
    navigate(`/user_profile/${senderId}`);
  };

  return (
    <div className="bg-white px-4 py-3 mb-3 max-w-md w-full">
      {/* Avatar, Message, Timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={senderPhotoURL} alt={`${senderName}'s profile`} />
            <AvatarFallback>{senderName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          {/* Message Content - Render HTML */}
          <p
            className="text-sm text-gray-900"
            dangerouslySetInnerHTML={{ __html: displayMessage }}
          ></p>
        </div>

        {/* Timestamp on Right */}
        <p className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</p>
      </div>

      {/* Buttons */}
      {type === "INTERESTED" && (
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
            onClick={() => handleAcceptInterest(notification)}
            style={{ fontFamily: "Georgia, serif" }}
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
