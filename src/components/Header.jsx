import React from "react";
import { ChevronDown, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Header = ({
  currentLocation,
  city,
  isSidebarOpen,
  onSidebarClick,
  user,
  onLocationClick,
}) => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-orange-500 p-6 pb-10 flex items-center justify-center shadow-md rounded-b-xl z-50">
        <button
          className="absolute left-4 p-2 text-white rounded-md hover:bg-orange-600 transition-colors"
          onClick={onSidebarClick}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div
          onClick={onLocationClick}
          className="flex flex-col items-center text-white text-center"
        >
          <span className="flex flex-row gap-2 items-center text-xs font-light">
            Location
            <ChevronDown size={16} />
          </span>
          <span className="text-sm font-semibold sm:text-base">
            {currentLocation ? city : "Choose a location"}
          </span>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={onSidebarClick} user={user} />
    </>
  );
};

export default Header;
