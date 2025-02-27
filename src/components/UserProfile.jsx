import React from "react";
import { useAuthState, useDbData } from "@/hooks/firebase";
import { User, Settings } from "lucide-react"; // Icon library for the top bar icons

// shadcn/ui components (you need to install them with `npx shadcn add avatar card switch label`)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Activity from "@components/Activity";

export default function ActivityConnectPage() {
  const [user] = useAuthState();
  const [userData, error] = useDbData(user ? `users/${user.uid}` : null);

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (userData === undefined) return <h1>Loading data...</h1>;
  if (!userData) return <h1>No data found</h1>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <div className="w-full bg-white shadow-md rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span className="font-semibold text-lg">ActivityHub</span>
          </div>
          <Settings className="h-5 w-5" />
        </div>

        {/* === Profile Section === */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-25 w-25">
            <AvatarImage
              src={user?.photoURL || "../../assets/bbq.jpg"}
              alt={userData?.firstName + userData?.lastName}
            />
            <AvatarFallback>
              {userData?.firstName?.charAt(0) || "U"}
            </AvatarFallback>{" "}
          </Avatar>

          {/* Profile Name & Tagline */}
          <h1 className="mt-2 text-xl font-bold">
            {userData?.firstName || "Guest"}
          </h1>
          <p className="text-sm text-gray-500">
            {userData?.age || "Welcome to ActivityHub!"}
          </p>

          {/* Edit Profile Button */}
          <Button className="mt-5 w-full h-12 bg-orange-600 hover:bg-orange-700 text-white">
            Edit Profile
          </Button>
        </div>

        {/* === Past Activities Card === */}
        <Card className="mt-6 bg-orange-100 text-stone-900 border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Past Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              {userData?.activities ? (
                Object.values(userData.activities).map((activity, index) => (
                  <p key={index} className="pl-4">
                    <Activity activity={activity} />
                  </p>
                ))
              ) : (
                <p className="pl-4 text-gray-500">No activities yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* === Safety & Trust Card === */}
        <Card className="mt-4 bg-gray-300 text-stone-900 border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Safety & Trust
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Toggle for Phone Verification */}
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

            {/* Toggle for Email Verification */}
            <div className="flex items-center justify-between">
              <Label>Email Verification</Label>
              <Switch
                defaultChecked
                className="
                  data-[state=unchecked]:bg-orange-300
                  data-[state=checked]:bg-orange-600
                "
              />{" "}
              {/* data-[state=checked]:bg-orange-600 → Makes switch orange when toggled ON */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
