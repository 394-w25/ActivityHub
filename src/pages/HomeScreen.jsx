import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/firebase";
import gymImage from "@assets/gym.jpg";
import museumImage from "@assets/museum.jpg";
import cookingImage from "@assets/cooking.jpg";
import ActivitiesMap from "@components/ActivitiesMap.jsx";
import ActivitiesFeed from "@components/ActivitiesFeed.jsx";
import { Bell } from "lucide-react";
import FiltersModal from "@/components/FiltersModal.jsx";

const HomeScreen = () => {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    console.log("New filters set as: ");
    console.log(newFilters);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="bg-gray-100 py-3 shadow-md flex justify-between px-6">
        <h1 className="text-xl font-bold">ActivityHub</h1>
        <div className="flex gap-4">
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

          {/* Notification Icon Button */}
          <button
            onClick={() => navigate("/notification")}
            className="flex items-center justify-center p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Bell size={24} />
          </button>
        </div>
      </div>
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Welcome to ActivityHub!</h1>
          <p className="text-lg text-gray-600">What’s happening near you?</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-4">Activities map</h2>
          <ActivitiesMap />
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Activity of the day</h2>
          <div className="bg-gray-100 rounded-lg shadow p-4 w-full max-w-xl mx-auto text-center">
            <img
              src={gymImage}
              alt="Activity of the Day"
              className="w-full h-auto object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold mt-4">Morning Yoga Session</h3>
            <p className="text-sm text-gray-500 mt-1">
              Fitness • Outdoor • Morning
            </p>
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Join
            </button>
          </div>
        </section>
        <section>
          <div className="text-center mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Filters
            </button>
          </div>
        </section>
        <section>
          <div>
            <ActivitiesFeed filters={filters} />
          </div>
        </section>
      </main>

      {isModalOpen && (
        <FiltersModal
          onClose={() => setIsModalOpen(false)}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default HomeScreen;
