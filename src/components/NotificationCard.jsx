import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function NotificationCard({ notification }) {
  const { senderName, senderPhotoURL, eventTitle, createdAt } = notification;

  // 4. Convert to relative time (e.g. "just now", "20 min ago")
  let timeAgo = "Just now";
  if (createdAt instanceof Date) {
    timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  }

  return (
    <Card className="border rounded-lg">
      <CardHeader className="px-4 pt-3 pb-1">
        {/* Top section: Avatar + Title on the left, Time on the right */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-15 w-15">
              <AvatarImage src={senderPhotoURL} alt={senderName} />
              <AvatarFallback>
                {senderName?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium leading-tight px-2 pt-5">
              {senderName} is interested in {eventTitle}
            </p>
          </div>
          <p className="text-xs text-gray-500 whitespace-nowrap pt-5">
            {timeAgo}
          </p>
        </div>
      </CardHeader>

      {/* Middle content: add empty space or any additional text if you want */}
      <CardContent className="px-4 py-2"></CardContent>

      {/* Bottom: Buttons */}
      <CardFooter className="flex space-x-2 px-23 py-2">
        <Button variant="outline">View Profile</Button>
        <Button variant="default">Accept</Button>
      </CardFooter>
    </Card>
  );
}
