import React, { useState, useEffect } from "react";
import ActivityDetails from "./ActivityDetails";
import { Bookmark } from "lucide-react";

const Activity = ({ activity }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {}, [activity]);

  if (!activity) {
    return;
  }

  const openDetails = () => {
    setDetailsOpen(true);
  };

  const closeDetails = () => {
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
      // weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  const getRandomColorClass = () => {
    const colors = ["#D9A5B5", "#8E97FD", "#FFCF86", "#76C79E", "#4E5567"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const randColor = getRandomColorClass();

  return (
    <>
      <div
        onClick={openDetails}
        className="bg-gray-100 h-45 rounded-lg shadow p-2 w-full cursor-pointer flex flex-1 flex-col justify-between items-start"
        style={
          activity.imageUrl
            ? {
                backgroundImage: `url(${activity.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { backgroundColor: randColor }
        }
      >
        <div className="p-1 bg-white bg-opacity-50 rounded-[4px]">
          <Bookmark className="text-gray-400" />
        </div>
        <div className="p-2 text-white">
          <p className="text-sm">
            {formatAnyTimestamp(activity.eventStartTimestamp)}
          </p>
          <h3 className="text-md font-bold mt-1">{activity.title}</h3>
        </div>
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
