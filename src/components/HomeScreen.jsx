import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivitiesMap from "@components/ActivitiesMap.jsx";
import ActivitiesFeed from "@components/ActivitiesFeed.jsx";
import FilterPage from "@components/FilterPage.jsx";
import { Bell } from "lucide-react";

const HomeScreen = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("Distance");
  const [lookingFor, setLookingFor] = useState("Friend");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState("");
  const [maxDistance, setMaxDistance] = useState(50);
  const [maxGroupSize, setMaxGroupSize] = useState(10);

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const handleFilterClose = () => {
    setShowFilter(false);
  };

  const filterProps = {
    sortBy,
    lookingFor,
    startTime,
    endTime,
    startDate,
    endDate,
    maxGroupSize,
    maxDistance,
  };

  const filterPageProps = {
    onClose: handleFilterClose,
    sortBy,
    setSortBy,
    lookingFor,
    setLookingFor,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    maxGroupSize,
    setMaxGroupSize,
    maxDistance,
    setMaxDistance,
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">ActivityHub</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/user_profile")}
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

        {/* Activities Map (hidden when filter is open) */}
        {!showFilter && (
          <div className="mt-4">
            <h3 className="text-xl font-bold">Activities Map</h3>
            <ActivitiesMap />
          </div>
        )}

        {/* Nearby Activities Header and Feed */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Nearby Activities</h3>
            <button
              onClick={handleFilterClick}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Filter
            </button>
          </div>
          <div className="mt-2 z-49 flex">
            <ActivitiesFeed {...filterProps} />
          </div>
        </div>
      </main>

      {/* Filter Modal - displays like the activity modals */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <FilterPage {...filterPageProps} />
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
