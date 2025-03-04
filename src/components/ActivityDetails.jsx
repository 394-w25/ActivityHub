import React from "react";
import { X, Calendar, MapPin, User } from "lucide-react"; // Using lucide-react for the X icon
import { handleUserInterested } from "@utils/notification";
import { useAuthState } from "@hooks/firebase";
const ActivityDetails = ({ activity, onClose }) => {
  const [user] = useAuthState();
  const handleJoinActivity = async () => {
    try {
      console.log("Joining activity:", activity);
      await handleUserInterested(activity, user);
    } catch (error) {
      console.error("Error joining activity:", error);
    }
  };
  return (
    <div className="relative w-full h-full p-4 bg-gray-900 text-white">
      <div className="max-w-sm h-full mx-auto bg-white text-black rounded-xl overflow-hidden shadow-lg relative">
        {/* Exit button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
        {/* Image */}
        <div>
          <img src={activity.imageUrl} className="w-full" />
        </div>
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-center">
              {activity.title || "N/A"}
            </h2>
          </div>
          {/* Timestamps */}
          <div className="flex items-center gap-x-4 text-gray-600">
            <Calendar
              size={48}
              className="shrink-0 bg-orange-200 rounded-lg p-2"
            />
            <div>
              <p className="font-semibold text-md">
                {new Date(activity.eventTimestamp).toLocaleString(undefined, {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs">
                {new Date(activity.eventTimestamp).toLocaleString(undefined, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          </div>
          {/* Location */}
          <div className="flex items-center gap-x-4 text-gray-600">
            <MapPin
              size={48}
              className="shrink-0 bg-orange-200 rounded-lg p-2"
            />
            <div>
              <p className="font-semibold text-md">
                {activity.location.split(",")[0] || "N/A"}
              </p>
              <p className="text-xs">
                {activity.location.split(",").slice(1, -4).join(",") || "N/A"}
              </p>
            </div>
          </div>
          {/* Group Size */}
          <div className="flex items-center gap-x-4 text-gray-600">
            <User size={48} className="shrink-0 bg-orange-200 rounded-lg p-2" />
            <div>
              <p className="font-semibold text-md">Slots Available</p>
              <p className="text-sm">{activity.groupSize || "N/A"}</p>
            </div>
          </div>
          {/* About Event */}
          <div>
            <h3 className="font-semibold mb-1">About Event</h3>
            <p className="text-sm text-gray-600">
              {activity.description || "No description provided."}
            </p>
          </div>

          {activity.imageUrl && (
            <img
              src={activity.imageUrl}
              alt="Activity"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Join Activity button */}
          <div className="pt-4">
            <button
              onClick={handleJoinActivity}
              className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Join Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
