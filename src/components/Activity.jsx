import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityDetails from "./ActivityDetails"; // adjust the import path as needed

const Activity = ({ activity }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const openDetails = () => setDetailsOpen(true);
  const closeDetails = () => setDetailsOpen(false);

  return (
    <>
      {/* The Activity Card */}
      <Card
        onClick={openDetails}
        className="p-4 shadow-md border border-gray-200 relative cursor-pointer"
      >
        {/* Activity Time in the top-right corner */}
        <div className="absolute top-2 right-4 text-sm text-gray-500">
          {new Date(activity.timestamp).toLocaleTimeString()}
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            {activity.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 font-semibold">
            {activity.location}
          </p>
          <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
        </CardContent>
      </Card>

      {/* Full-page overlay for ActivityDetails */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <ActivityDetails activity={activity} onClose={closeDetails} />
        </div>
      )}
    </>
  );
};

export default Activity;
