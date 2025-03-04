import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose, user }) => {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="text-2xl font-semibold">Menu</h2>
          <button onClick={onClose} className="p-2">
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col p-6 space-y-6">
          <Link
            to={user ? `/user_profile/${user.uid}` : "/login"}
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            Profile
          </Link>
          <Link
            to="/notification"
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            Notifications
          </Link>
          <Link
            to="/create_activity"
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            Create Activity
          </Link>
          <Link
            to="/home"
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            Messages
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
