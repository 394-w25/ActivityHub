import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Bell,
  MessageCircle,
  CirclePlus,
  Calendar,
  Bookmark,
  Mail,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";
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
        <div className="p-5 flex justify-between items-center flex-col">
          <button onClick={onClose} className="p-2 mr-auto">
            <ArrowLeft size={28} />
          </button>
          {user ? (
            <>
              <Avatar className="w-18 h-18">
                <AvatarImage src={user.photoURL} alt={name} />
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold">
                {user.displayName ?? user.name}
              </h2>
            </>
          ) : (
            <h2 className="text-2xl font-semibold">Menu</h2>
          )}
        </div>

        <nav className="flex flex-col p-6 space-y-6">
          <Link
            to={user ? `/user_profile/${user.uid}` : "/"}
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            <User className="inline mr-4" />
            My Profile
          </Link>
          <Link
            to={user ? `/notification` : "/"}
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            <Bell className="inline mr-4" />
            Notifications
          </Link>
          <Link
            to="/chats"
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            <MessageCircle className="inline mr-4" />
            Messages
          </Link>
          <Link
            to={user ? `/create_activity` : "/"}
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
          >
            <CirclePlus className="inline mr-4" />
            Create Activity
          </Link>
          <Link className="text-lg font-medium text-gray-700 hover:text-orange-500">
            <Calendar className="inline mr-4" />
            Calendar
          </Link>
          <Link className="text-lg font-medium text-gray-700 hover:text-orange-500">
            <Bookmark className="inline mr-4" />
            Saved
          </Link>
          <Link className="text-lg font-medium text-gray-700 hover:text-orange-500">
            Following
          </Link>
          <Link className="text-lg font-medium text-gray-700 hover:text-orange-500">
            Followers
          </Link>
          <Link className="text-lg font-medium text-gray-700 hover:text-orange-500">
            <Mail className="inline mr-4" />
            Contact Us
          </Link>
          <Link className="text-lg font-medium text-gray-700 hover:text-orange-500">
            <Settings className="inline mr-4" />
            Settings
          </Link>
          <Link className="text-lg font-medium text-gray-700 hover:text-orange-500">
            <CircleHelp className="inline mr-4" />
            Help & FAQs
          </Link>
          <Link
            className="text-lg font-medium text-gray-700 hover:text-orange-500"
            onClick={handleSignOut}
          >
            <LogOut className="inline mr-4" />
            Sign Out
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
