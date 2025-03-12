import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Calendar, MapPin, User } from "lucide-react"; // Using lucide-react for the X icon
import { handleUserInterested } from "@utils/notification";
import { useAuthState } from "@hooks/firebase";
import { createOrGetChat } from "@/hooks/firebase";
const ActivityDetails = ({ activity, onClose }) => {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const handleJoinActivity = async () => {
    setIsPending(true);
    try {
      await handleUserInterested(activity, user);
    } catch (error) {
      console.error("Error joining activity:", error);
      setIsPending(false);
    }
  };

  const approvedArray = activity.approved
    ? Object.values(activity.approved)
    : [];

  return (
    <div className="relative w-full h-full p-4 bg-gray-900 text-white">
      <div className="max-w-sm h-full mx-auto bg-white text-black rounded-xl overflow-scroll shadow-lg relative">
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
          {/* Approved Users section (below top image, above the title) */}
          {/* Approved Users section (below top image, above the title) */}
          {approvedArray.length > 0 ? (
            <div className="bg-white rounded-full py-2 px-4 shadow-md flex items-center gap-3">
              {/* Show up to 3 avatars in a stacked style */}
              <div className="flex -space-x-2">
                {approvedArray.slice(0, 3).map(({ userId }) => (
                  <div
                    key={userId}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium ring-2 ring-white"
                  >
                    {userId.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>

              {/* Text aligned to the right */}
              <span className="text-sm text-gray-800 ml-auto">
                {approvedArray.length > 3
                  ? `+${approvedArray.length - 3} Going`
                  : `${approvedArray.length} Going`}
              </span>
            </div>
          ) : (
            <div className="bg-white rounded-full py-2 px-4 shadow-md flex flex-col items-center justify-center gap-1">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                ?
              </div>
              <span className="text-sm text-gray-800">
                Be the first to join
              </span>
            </div>
          )}

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

          <div className="pt-4">
            <button
              onClick={() => navigate(`/user_profile/${activity.posterUid}`)}
              className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              View Host Profile
            </button>
          </div>

          {/* Join Activity button */}
          <div className="pt-4">
            <button
              onClick={handleJoinActivity}
              disabled={isPending}
              className={`w-full py-2 px-4 text-white rounded-lg transition-colors ${
                isPending
                  ? "bg-orange-700 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {isPending ? "Interest Sent" : "Interested"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
