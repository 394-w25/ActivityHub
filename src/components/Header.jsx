import React from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Header = ({ currentLocation, isSidebarOpen, onSidebarClick, user }) => {
  return (
    <>
      {/* Full-width Header Bar with shadow and only bottom corners rounded */}
      <header className="fixed top-0 left-0 right-0 bg-orange-500 p-4 flex items-center justify-between shadow-md rounded-b-xl z-50">
        {/* Left: Hamburger Button */}
        <button
          className="p-2 text-white rounded-md hover:bg-orange-600 transition-colors"
          onClick={onSidebarClick}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-white text-center">
          <span className="text-xs font-light">Current Location</span>
          <span className="text-sm font-semibold sm:text-base">
            {currentLocation
              ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
              : "Location unavailable"}
          </span>
        </div>
      </header>

      {/* Sidebar (overlay or drawer) */}
      <Sidebar isOpen={isSidebarOpen} onClose={onSidebarClick} user={user} />
    </>
  );
};

export default Header;
