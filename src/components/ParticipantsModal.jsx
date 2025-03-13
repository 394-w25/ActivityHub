import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDbData } from "@/hooks/firebase";

const ParticipantItem = ({ participant, onClose }) => {
  const navigate = useNavigate();
  const [data] = useDbData(`/users/${participant.userId}`);

  if (data === undefined) return <div className="text-black">Loading...</div>;
  if (data === null) return <div className="text-black">No user found.</div>;

  // Fallback letter
  const firstInitial = data.name ? data.name.charAt(0).toUpperCase() : "?";

  // Check if photoURL is a valid HTTP URL
  const photoURL =
    data.photoURL && data.photoURL.startsWith("http") ? data.photoURL : null;

  return (
    <li
      onClick={() => {
        onClose();
        navigate(`/user_profile/${participant.userId}`);
      }}
      className="flex flex-row px-4 py-2 text-black justify-between items-center gap-4 mb-4 cursor-pointer"
    >
      <div className="flex flex-row gap-4 items-center justify-center">
        {/* If photoURL is valid, show image; otherwise show fallback letter */}
        {photoURL ? (
          <img
            src={photoURL}
            alt={data.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-white">
            {firstInitial}
          </div>
        )}
        <div className="text-lg">{data.name || "Unknown"}</div>
      </div>
      <div className="text-gray-400 text-md">Participant</div>
    </li>
  );
};

const ParticipantsModal = ({ participants, onClose }) => {
  return (
    <div className="fixed inset-0 z-100 bg-white overflow-auto">
      <div className="flex items-center p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="flex items-center text-gray-700 focus:outline-none"
        >
          <ArrowLeft size={24} className="mr-2" />
          <span>Event Details</span>
        </button>
      </div>

      <div className="p-4 flex flex-col justify-center items-center">
        <h2 className="text-2xl text-gray-400 font-semibold">Attendees</h2>
        {participants && participants.length > 0 ? (
          <ul className="w-full space-y-4 py-4">
            {participants.map((participant) => (
              <ParticipantItem
                key={participant.userId}
                participant={participant}
                onClose={onClose}
              />
            ))}
          </ul>
        ) : (
          <p className="text-black text-center pt-4">No participants yet.</p>
        )}
      </div>
    </div>
  );
};

export default ParticipantsModal;
