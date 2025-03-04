import React from "react";
import { useAuthState, useDbData } from "@/hooks/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [user] = useAuthState();

  const { id: profileUserId } = useParams();
  console.log("profileUserId", profileUserId);
  const [userData, error] = useDbData(
    profileUserId ? `users/${profileUserId}` : null,
  );

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (userData === undefined) return <h1>Loading data...</h1>;
  if (!userData) return <h1>No data found</h1>;

  // For demonstration, we’ll use placeholders if the userData fields are empty.
  const displayName = userData?.firstName || "Jake";
  const displayBio =
    userData?.bio ||
    `No bio available. This is a placeholder bio. You can edit your profile to add a personal touch!`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user?.photoURL} alt={displayName} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold mt-4">{displayName}</h2>
        </div>

        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="about">ABOUT</TabsTrigger>
            <TabsTrigger value="event">EVENT</TabsTrigger>
            <TabsTrigger value="trust">TRUST BADGE</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-4">
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {displayBio}
            </p>
          </TabsContent>

          <TabsContent value="event" className="mt-4">
            {userData?.activities ? (
              Object.values(userData.activities).map((activity, index) => (
                <div key={index} className="text-sm text-gray-700 mb-2">
                  • {activity.title || "Untitled Activity"}
                </div>
              ))
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
            <Button className="bg-orange-400 text-white hover:bg-orange-500">
              Chat
            </Button>
            <Button className="bg-orange-400 text-white hover:bg-orange-500">
              Accept
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
