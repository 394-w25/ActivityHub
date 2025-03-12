import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDbData } from "@/hooks/firebase";

const ParticipantItem = ({ participant, onClose }) => {
  const navigate = useNavigate();
  const [data, error] = useDbData(`/users/${participant.userId}`);

  if (data === undefined) return <div className="text-black">Loading...</div>;
  if (data === null) return <div className="text-black">No user found.</div>;

  return (
    <li
      onClick={() => {
        onClose();
        navigate(`/user_profile/${participant.userId}`);
      }}
      className="flex flex-row px-4 py-2 text-black justify-between items-center gap-4 mb-4 cursor-pointer"
    >
      <div className="flex flex-row gap-4 items-center justify-center">
        <img
          src={data.photoURL || "User"}
          alt={data.name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
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
