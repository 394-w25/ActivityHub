import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Calendar, MapPin, User } from "lucide-react"; // Using lucide-react for the X icon
import { handleUserInterested } from "@utils/notification";
import { useAuthState } from "@hooks/firebase";
import { useDbData } from "@/hooks/firebase";
import ParticipantsModal from "@/components/ParticipantsModal"; // Import your modal

function ApprovedUserAvatar({ userId }) {
  const [userData, error] = useDbData(`users/${userId}`);
  const fallbackLetter =
    userData && userData.name
      ? userData.name.charAt(0).toUpperCase()
      : userId.charAt(0).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex justify-center text-xs font-medium ring-2 ring-white overflow-hidden">
      {userData && userData.photoURL ? (
        <img
          src={userData.photoURL}
          alt={userData.name || "User Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        fallbackLetter
      )}
    </div>
  );
}

const ActivityDetails = ({ activity, onClose }) => {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

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

  const eventStartTimestamp =
    activity.eventStartTimestamp || activity.eventTimestamp || null;

  const eventEndTimestamp = activity.eventEndTimestamp || null;

  return (
    <div className="z-3 relative w-full h-full text-white">
      <div className="flex flex-col items-center w-full h-full bg-white text-black overflow-scroll shadow-lg relative">
        {/* Exit button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
        {/* Image */}
        <div>
          <img src={activity.imageUrl} className="object-cover w-full" />
        </div>
        <div className="p-6 space-y-4">
          {/* Approved Users section (below top image, above the title) */}
          {approvedArray.length > 0 ? (
            <div
              onClick={() => setShowParticipantsModal(true)}
              className={
                activity.imageUrl
                  ? "cursor-pointer relative flex justify-between items-center z-99 py-4 px-6 text-orange-500 font-semibold bg-white rounded-full mt-[-55px] shadow-lg hover:shadow-sm"
                  : "cursor-pointer relative flex justify-between items-center z-99 py-4 px-6 text-orange-500 font-semibold bg-white rounded-full mt-[30px] shadow-lg hover:shadow-sm"
              }
            >
              {/* Show up to 3 avatars in a stacked style */}
              <div className="flex -space-x-2">
                {approvedArray.slice(0, 3).map(({ userId }) => (
                  <ApprovedUserAvatar key={userId} userId={userId} />
                ))}
              </div>
              {/* Text aligned to the right */}
              <span className="text-sm ml-auto">
                {approvedArray.length > 3
                  ? `+${approvedArray.length - 3} Going`
                  : `${approvedArray.length} Going`}
              </span>
            </div>
          ) : (
            <div
              className={
                activity.imageUrl
                  ? "cursor-pointer relative flex justify-between items-center z-99 py-4 px-6 text-orange-500 bg-white rounded-full mt-[-50px] shadow-lg hover:shadow-sm"
                  : "cursor-pointer relative flex justify-between items-center z-99 py-4 px-6 text-orange-500 bg-white rounded-full mt-[30px] shadow-lg hover:shadow-sm"
              }
            >
              <div className="flex flex-1 justify-center text-center font-semibold text-sm">
                Be the first to join!
              </div>
            </div>
          )}
          {/* Title */}
          <div>
            <h2 className="text-2xl text-orange-600 font-bold text-center">
              {activity.title || "N/A"}
            </h2>
          </div>
          {/* Timestamps */}
          <div className="flex gap-x-4 text-gray-600">
            <Calendar
              size={48}
              className="shrink-0 text-orange-600 bg-orange-100 rounded-lg p-2"
            />

            {/* Start Time */}
            <div>
              <p className="font-semibold text-md">
                {eventStartTimestamp
                  ? new Date(eventStartTimestamp).toLocaleString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "Time not provided"}
              </p>
              <p className="text-xs">
                {eventStartTimestamp
                  ? new Date(eventStartTimestamp).toLocaleString(undefined, {
                      weekday: "long",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : ""}
              </p>
            </div>

            <div>to</div>

            {/* End Time */}
            <div>
              <p className="font-semibold text-md">
                {eventEndTimestamp
                  ? new Date(eventEndTimestamp).toLocaleString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "Time not provided"}
              </p>
              <p className="text-xs">
                {eventEndTimestamp
                  ? new Date(eventEndTimestamp).toLocaleString(undefined, {
                      weekday: "long",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-x-4 text-gray-600">
            <MapPin
              size={48}
              className="shrink-0 text-orange-600 bg-orange-100 rounded-lg p-2"
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
          <div className="flex gap-x-4 text-gray-600">
            <User
              size={48}
              className="shrink-0 text-orange-600 bg-orange-100 rounded-lg p-2"
            />
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

          <div className="pt-4">
            <button
              onClick={() => navigate(`/user_profile/${activity.posterUid}`)}
              className="w-full py-2 px-4 bg-orange-400 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
      {/* Conditionally render the ParticipantsModal */}
      {showParticipantsModal && (
        <ParticipantsModal
          participants={approvedArray}
          hostId={activity.posterUid}
          onClose={() => setShowParticipantsModal(false)}
        />
      )}
    </div>
  );
};

export default ActivityDetails;
