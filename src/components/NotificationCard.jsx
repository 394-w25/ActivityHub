import { handleAcceptInterest } from "@/utils/notification";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
    recipientId,
    type,
    message,
  } = notification;

  // convert Firestore timestamp to a Date object if needed?
  let timeAgo = "Just now";
  if (createdAt?.seconds) {
    timeAgo = formatDistanceToNow(new Date(createdAt.seconds * 1000), {
      addSuffix: true,
    });
  }

  // for testing: the `message` field from Firestore or create a fallback message
  const displayMessage =
    message ||
    (type === "ACCEPTED"
      ? `Your interest in ${eventTitle} has been accepted!`
      : `${senderName} is interested in ${eventTitle}`);

  // to navigate to profile
  const handleViewProfile = () => {
    if (!senderId) {
      console.error("Sender ID is missing, cannot view profile.");
      return;
    }
    console.log(`Navigating to profile of user: ${senderId}`);
    navigate(`/profile/${senderId}`);
  };

  return (
    <Card className="border rounded-lg">
      <CardHeader className="px-4 pt-3 pb-1">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={senderPhotoURL}
                alt={`${senderName}'s profile picture`}
              />
              <AvatarFallback>
                {senderName?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <p
              className="text-sm font-medium leading-tight px-2 pt-5"
              dangerouslySetInnerHTML={{ __html: displayMessage }}
            ></p>
          </div>
          <p className="text-xs text-gray-500 whitespace-nowrap pt-5">
            {timeAgo}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2"></CardContent>

      {/* Show "Accept" button only for "INTERESTED" notifications */}
      {type === "INTERESTED" && (
        <CardFooter className="flex space-x-2 px-6 py-2">
          <Button variant="outline" onClick={handleViewProfile}>
            View Profile
          </Button>
          <Button
            variant="default"
            onClick={() => handleAcceptInterest(notification)}
          >
            Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
