import React from "react";
import { User, Settings } from "lucide-react"; // Icon library for the top bar icons

// shadcn/ui components (you need to install them with `npx shadcn add avatar card switch label`)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ActivityConnectPage() {
  return (
    // Outer container that takes full height of the screen
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      {/* Inner container: fills width, removes margins for desktop */}
      <div className="w-full bg-white shadow-md rounded-md p-4">
        {/* === Top Bar === */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: App icon + Name */}
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" /> {/* User icon */}
            <span className="font-semibold text-lg">ActivityHub</span>
          </div>
          <Settings className="h-5 w-5" /> {/* Settings Icon */}
        </div>

        {/* === Profile Section === */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar Component (shadcn/ui) */}
          <Avatar className="h-25 w-25">
            <AvatarImage src="../../assets/bbq.jpg" alt="Alex Johnson" />
            <AvatarFallback>AJ</AvatarFallback>{" "}
            {/* Fallback if no image loads */}
          </Avatar>

          {/* Profile Name & Tagline */}
          <h1 className="mt-2 text-xl font-bold">Alex Johnson</h1>
          <p className="text-sm text-gray-500">
            Adventure Seeker | Nature Lover
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
            {/* No bullet points, just indentation */}
            <div className="space-y-2 text-sm">
              <p className="pl-4">Hiking at Rocky Mountain – July 2023</p>
              <p className="pl-4">Kayaking Adventure – June 2023</p>
              <p className="pl-4">Nature Photography Workshop – May 2023</p>
            </div>
          </CardContent>
        </Card>
        {/* Tailwind breakdown:
            - border-0 → Removes default border
            - shadow-none → Removes shadow for flat design
            - pl-4 → Indentation for activity items
        */}

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
