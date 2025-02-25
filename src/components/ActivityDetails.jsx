import React from "react";
import { X } from "lucide-react"; // Using lucide-react for the X icon
import { useAuthState } from "@/hooks/firebase";
import { useDbUpdate } from "@/hooks/firebase";
import { v4 as uuidv4 } from "uuid";

const ActivityDetails = ({ activity, onClose }) => {
  const [user] = useAuthState();
  const [updateData] = useDbUpdate(`notifications/${uuidv4()}`);

  const handleJoinActivity = async () => {
    if (!user) return;

    if (user.uid === activity.posterUid) {
      alert("You can’t join your own activity!");
      return;
    }

    try {
      console.log("Joining activity:", activity);

      const notificationData = {
        recipientId: activity.posterUid,
        senderId: user.uid,
        senderName: user.displayName,
        senderPhotoURL: user.photoURL,
        eventTitle: activity.title,
        createdAt: Date.now(),
      };
      await updateData(notificationData);
    } catch (error) {
      console.error("Error joining activity:", error);
    }
  };

  return (
    <div className="relative w-full h-full p-4 bg-gray-900 text-white">
      <div className="max-w-sm mx-auto bg-white text-black rounded-xl overflow-hidden shadow-lg relative">
        {/* Exit button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold">{activity.title || "N/A"}</h2>
          </div>

          {/* Timestamps and Group Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Created:</span>
              <span>
                {new Date(activity.creationTimestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Event Time:</span>
              <span>{new Date(activity.eventTimestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Group Size:</span>
              <span>{activity.groupSize || "N/A"}</span>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Location */}
          <div>
            <h3 className="font-semibold mb-1">Location</h3>
            <p className="text-sm text-gray-600">
              {activity.location || "N/A"}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
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
