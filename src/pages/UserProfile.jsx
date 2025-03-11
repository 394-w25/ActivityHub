import { React, useState } from "react";
import { createOrGetChat, useAuthState, useDbData } from "@/hooks/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useParams } from "react-router-dom";
import Activity from "@/components/Activity";
import { ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function UserProfile() {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing((prev) => !prev);
  };

  const { id: profileUserId } = useParams();
  const [userData, error] = useDbData(
    profileUserId ? `users/${profileUserId}` : null,
  );

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (userData === undefined) return <h1>Loading data...</h1>;
  if (!userData) return <h1>No data found</h1>;

  // For demonstration, we’ll use placeholders if the userData fields are empty.
  const name = userData?.name || "Unknown";
  const displayBio =
    userData?.bio ||
    `No bio available. This is a placeholder bio. You can edit your profile to add a personal touch!`;

  const handleChatClick = async () => {
    const chatId = await createOrGetChat(user?.uid, profileUserId);
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <div className="flex flex-row justify-start items-center gap-4 pl-2 pt-4 pb-4">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-6 h-6"
        />

        {user?.uid !== profileUserId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100">
                <MoreVertical className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={() => alert("User Blocked!")}
              >
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="w-full max-w-sm rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userData?.photoURL} alt={name} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold mt-4">{name}</h2>
          {user?.uid !== profileUserId && (
            <Button
              onClick={handleFollowClick}
              className={`mt-5 w-40 text-white ${
                isFollowing
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-orange-400 hover:bg-orange-500"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="about">ABOUT</TabsTrigger>
            <TabsTrigger value="event">EVENTS</TabsTrigger>
            <TabsTrigger value="trust">TRUST BADGE</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-4">
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {displayBio}
            </p>
          </TabsContent>

          <TabsContent value="event" className="mt-4">
            {userData?.hosted_activities ? (
              Object.values(userData.hosted_activities).map(
                (activity, index) => (
                  <Activity key={index} activity={activity} />
                ),
              )
            ) : (
              <p className="text-gray-500">No events/activities yet.</p>
            )}
          </TabsContent>

          <TabsContent value="trust" className="mt-4">
            <div className="flex items-center justify-between">
              <Label>Phone Verification</Label>
              <Switch
                defaultChecked
                className="
                  data-[state=unchecked]:bg-orange-300
                  data-[state=checked]:bg-orange-600
                "
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Label>Email Verification</Label>
              <Switch
                defaultChecked
                className="
                  data-[state=unchecked]:bg-orange-300
                  data-[state=checked]:bg-orange-600
                "
              />{" "}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap gap-2 mt-10">
          {["Hike", "Food", "Concert", "Music", "Art", "Movie", "Others"].map(
            (tag) => (
              <span
                key={tag}
                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ),
          )}
        </div>

        {/* only showing buttons when viewing other user's profile */}
        {user?.uid !== profileUserId && (
          <div className="flex justify-around mt-10">
            <Button
              onClick={() => handleChatClick()}
              className="bg-orange-400 text-white hover:bg-orange-500"
            >
              Chat
            </Button>
            <Button className="bg-orange-400 text-white hover:bg-orange-500">
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
