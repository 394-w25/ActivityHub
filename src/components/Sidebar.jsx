import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { firebaseSignOut } from "@/hooks/firebase";

const Sidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
            to={user ? `/user_profile/${user.uid}` : "/"}
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            Profile
          </Link>
          <Link
            to={user ? `/notification` : "/"}
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            Notifications
          </Link>
          <Link
            to={user ? `/create_activity` : "/"}
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

        {/* Sign Out Button at the bottom */}
        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
