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

  // Convert Firestore timestamp to readable format
  let timeAgo = "Just now";
  if (createdAt?.seconds) {
    timeAgo = formatDistanceToNow(new Date(createdAt.seconds * 1000), {
      addSuffix: true,
    });
  }

  // Construct notification message without repeating the sender's name
  const displayMessage = message?.includes(senderName)
    ? message
    : `${senderName} ${message}`;

  // Navigate to user profile
  const handleViewProfile = () => {
    if (!senderId) {
      console.error("Sender ID is missing, cannot view profile.");
      return;
    }
    navigate(`/profile/${senderId}`);
  };

  return (
    <div className="bg-white px-4 py-3 mb-3 max-w-md w-full">
      {/* Top Section: Avatar, Message, Timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={senderPhotoURL} alt={`${senderName}'s profile`} />
            <AvatarFallback>{senderName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          {/* Message Content */}
          <p className="text-sm text-gray-900">{displayMessage}</p>
        </div>

        {/* Right-aligned Timestamp */}
        <p className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</p>
      </div>

      {/* Action Buttons - Now Aligned with the Message */}
      {type === "INTERESTED" && (
        <div className="flex space-x-2 mt-2 ml-16">
          <Button
            className="px-4 py-1 text-gray-700 bg-transparent border border-gray-300 shadow-none hover:bg-gray-100"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          <Button
            className="px-4 py-1 bg-[#ED904A] text-white hover:bg-[#E07A5F] border-none shadow-none"
            onClick={() => handleAcceptInterest(notification)}
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
