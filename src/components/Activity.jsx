import React, { useState, useEffect } from "react";
import ActivityDetails from "./ActivityDetails";

const Activity = ({ activity }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    console.log("Activity prop received:", activity);
  }, [activity]);

  const openDetails = () => {
    console.log("Opening details for activity:", activity);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    console.log("Closing details for activity:", activity);
    setDetailsOpen(false);
  };

  return (
    <>
      <div
        onClick={openDetails}
        className="bg-gray-100 rounded-lg shadow p-4 w-full cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{activity.eventTimestamp}</p>
        </div>
        <h3 className="text-md font-semibold mt-1">{activity.title}</h3>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <ActivityDetails activity={activity} onClose={closeDetails} />
        </div>
      )}
    </>
  );
};

export default Activity;
