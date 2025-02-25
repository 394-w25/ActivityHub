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

  function formatAnyTimestamp(timestamp) {
    let date;

    // Check what format the timestamp is in
    if (typeof timestamp === "number" || /^\d+$/.test(timestamp)) {
      // It's in milliseconds (numeric)
      date = new Date(Number(timestamp));
    } else if (typeof timestamp === "string" && timestamp.includes("T")) {
      // It's in ISO format like "2025-02-28T18:00"
      date = new Date(timestamp);
    } else {
      // Invalid format
      return "Invalid date format";
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Format the date
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return (
    <>
      <div
        onClick={openDetails}
        className="bg-gray-100 rounded-lg shadow p-4 w-full cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <p className="text-sm tessxt-gray-500">
            {formatAnyTimestamp(activity.eventTimestamp)}
          </p>
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
