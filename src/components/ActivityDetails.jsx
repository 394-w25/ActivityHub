import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ActivityDetails = ({ activity }) => {
  return (
    <div className="relative w-full h-full p-4 bg-gray-900 text-white">
      <div className="mb-4 text-lg font-semibold">Activity Details</div>

      <div className="max-w-sm mx-auto bg-white text-black rounded-xl overflow-hidden shadow-lg">
        <Card className="p-4 space-y-4">
          {/* title time and location in header */}
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-bold">
              Yoga in the Park
            </CardTitle>
            <CardDescription className="mt-1">
              Saturday, 10:00 AM <br />
              Central Park, NYC
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            {/* creator and join activity */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Created by Sarah Thompson</p>
              <Button variant="default" size="sm">
                Join Activity
              </Button>
            </div>

            <Separator />

            {/* description */}
            <p className="text-sm text-gray-600">
              Join us for a relaxing yoga session in Central Park. All levels
              are welcome. Bring your mat and water bottle.
            </p>

            {/* group info */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Group Details</h3>
              <p className="text-sm text-gray-600">Group Size: 20 people</p>
              <p className="text-sm text-gray-600">
                Interests: Health, Wellness, Community
              </p>
            </div>

            <Separator />

            {/* safety section */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold">Safety &amp; Trust</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Phone Verified</Badge>
                <Badge variant="outline">Email Verified</Badge>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>Reviews:</p>
                <p>“A wonderful experience, highly recommend!” — Emily R.</p>
              </div>
            </div>
          </CardContent>

          {/* can be removed, chat with creator button */}
          <CardFooter className="p-0 pt-2">
            <Button className="w-full">Chat with Creator</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ActivityDetails;
