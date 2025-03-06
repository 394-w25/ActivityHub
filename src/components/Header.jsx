import React, { useState } from "react";
import { Menu, Search } from "lucide-react";
import Sidebar from "./Sidebar";

/**
 * Props:
 *  - currentLocation (string): The text to display for the user's current location
 */
const Header = ({
  currentLocation = "Your City, ST",
  isSidebarOpen,
  onSidebarClick,
  user,
}) => {
  return (
    <>
      {/* Header Bar */}
      <header className="bg-orange-500 p-4 flex items-center justify-between shadow-md">
        {/* Left: Hamburger Button */}
        <button
          className="p-2 text-white rounded-md hover:bg-orange-600 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Middle: Current Location */}
        <div className="flex flex-col items-center text-white text-center">
          <span className="text-xs font-light">Current Location</span>
          <span className="text-sm font-semibold sm:text-base">
            {currentLocation}
          </span>
        </div>

        {/* Right: Search Button */}
        <button className="p-2 text-white rounded-md hover:bg-orange-600 transition-colors">
          <Search className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar (overlay or drawer) */}
      <Sidebar isOpen={isSidebarOpen} onClose={onSidebarClick} user={user} />
    </>
  );
};

export default Header;
