import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState, firebaseSignOut } from "@/hooks/firebase";
import gymImage from "@assets/gym.jpg";
import museumImage from "@assets/museum.jpg";
import cookingImage from "@assets/cooking.jpg";
import ActivitiesMap from "@components/ActivitiesMap.jsx";
import ActivitiesFeed from "@components/ActivitiesFeed.jsx";
import FilterPage from "@components/FilterPage.jsx";
import { Filter } from "lucide-react";
import FiltersModal from "@/components/FiltersModal.jsx";
import Sidebar from "@components/Sidebar";
import Header from "@components/Header";

const HomeScreen = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("Distance");
  const [lookingFor, setLookingFor] = useState("Friend");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState("");
  const [maxDistance, setMaxDistance] = useState(50);
  const [maxGroupSize, setMaxGroupSize] = useState(10);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const filterPageProps = {
    onClose: toggleFilter,
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

  const [user] = useAuthState();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    console.log("New filters set as: ", newFilters);
    setIsModalOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} user={user} />

      {/* Header: Using our new Header component */}
      <Header
        currentLocation="Chicago, IL"
        isSidebarOpen={isSidebarOpen}
        onSidebarClick={toggleSidebar}
      />

      {/* Main Content */}
      <main className="p-4">
        <h2 className="text-2xl font-semibold">Welcome to ActivityHub!</h2>
        <p className="mt-2">What's happening near you?</p>

        {/* Activities Map */}
        <div className="mt-4">
          <h3 className="text-xl font-bold">Activities Map</h3>
          <ActivitiesMap />
        </div>

        {/* Nearby Activities Header with Filter Button */}
        <div className="mt-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Nearby Activities</h3>
          <button
            onClick={toggleFilter}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Filter size={20} />
            Filter and Sort
          </button>
        </div>

        {/* Activities Feed */}
        <div className="mt-4">
          <ActivitiesFeed {...filterProps} />
        </div>
      </main>

      {/* Filter Page Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
            <FilterPage {...filterPageProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
