import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState, firebaseSignOut } from "@/hooks/firebase";
import gymImage from "@assets/gym.jpg";
import museumImage from "@assets/museum.jpg";
import cookingImage from "@assets/cooking.jpg";
import ActivitiesMap from "@components/ActivitiesMap.jsx";
import ActivitiesFeed from "@components/ActivitiesFeed.jsx";
import FilterPage from "@components/FilterPage.jsx";
import { Filter, Search, X } from "lucide-react";
import FiltersModal from "@/components/FiltersModal.jsx";
import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import { LocationContext } from "@components/LocationContext";

const HomeScreen = () => {
  const { location, permissionStatus, getUserLocation } =
    useContext(LocationContext);

  useEffect(() => {
    // Only request location if permission isn't explicitly denied
    if (permissionStatus !== "denied") {
      const getLocation = async () => {
        try {
          await getUserLocation();
        } catch (error) {
          console.error("Error fetching location in HomeScreen:", error);
        }
      };

      getLocation();
    }
  }, [permissionStatus]);

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
    }
  };

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
    searchQuery,
  };

  const [user] = useAuthState();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {}, [location, permissionStatus]);

  return (
    <div className="min-h-screen relative pt-16">
      {/* Header: Fixed to top with rounded edges */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="mx-2 mt-2">
          <div className="shadow-md overflow-hidden">
            <Header
              currentLocation={location}
              isSidebarOpen={isSidebarOpen}
              onSidebarClick={toggleSidebar}
              user={user}
            />
          </div>
        </div>
      </div>

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
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search activities..."
                  className="px-3 py-2 outline-none bg-transparent"
                />
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="p-2 text-black rounded-md hover:bg-gray-100 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={toggleFilter}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              <Filter size={20} />
              Filter and Sort
            </button>
          </div>
        </div>

        {/* Activities Feed */}
        <div className="mt-4">
          <ActivitiesFeed {...filterProps} />
        </div>
      </main>

      {/* Filter Page Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 sm:p-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] max-h-[90vh] overflow-y-auto">
            <FilterPage {...filterPageProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
