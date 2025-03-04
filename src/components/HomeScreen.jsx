import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/firebase";
import gymImage from "@assets/gym.jpg";
import museumImage from "@assets/museum.jpg";
import cookingImage from "@assets/cooking.jpg";
import ActivitiesMap from "@components/ActivitiesMap.jsx";
import ActivitiesFeed from "@components/ActivitiesFeed.jsx";
import FilterPage from "@components/FilterPage.jsx";
import { Bell, Menu } from "lucide-react";
import Sidebar from "@components/Sidebar";

const HomeScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [user] = useAuthState();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold">ActivityHub</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/user_profile/${user.uid}`)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/create_activity")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Create Activity
          </button>
          <button
            onClick={() => navigate("/notification")}
            className="flex items-center justify-center p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Bell />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <h2 className="text-2xl font-semibold">Welcome to ActivityHub!</h2>
        <p className="mt-2">What's happening near you?</p>

        <div className="mt-4">
          <h3 className="text-xl font-bold">Activities Map</h3>
          <ActivitiesMap />
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold">Nearby Activities</h3>
          <ActivitiesFeed />
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
