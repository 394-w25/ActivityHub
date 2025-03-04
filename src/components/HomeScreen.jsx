import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/firebase";
import gymImage from "@assets/gym.jpg";
import museumImage from "@assets/museum.jpg";
import cookingImage from "@assets/cooking.jpg";
import ActivitiesMap from "@components/ActivitiesMap.jsx";
import ActivitiesFeed from "@components/ActivitiesFeed.jsx";
import { Bell } from "lucide-react";

const HomeScreen = () => {
  const [user] = useAuthState();
  const navigate = useNavigate();

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
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">Filter by</h2>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {["Yoga", "Running", "Cycling", "Dance Class"].map((filter) => (
              <button
                key={filter}
                className="px-6 py-2 bg-gray-200 border border-gray-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:border-gray-500 hover:text-black transition-all duration-200"
              >
                {filter}
              </button>
            ))}
          </div>
        </section>
        {/*}
        <section>
          <div className="flex justify-between gap-4">
            <div className="bg-gray-100 rounded-lg shadow p-4 w-full max-w-[500px]">
              <img
                src={museumImage}
                alt="Art Workshop"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">1 hour</p>
                <h3 className="text-md font-semibold">Art Workshop</h3>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg shadow p-4 w-full max-w-[500px]">
              <img
                src={cookingImage}
                alt="Cooking Class"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">2 hours</p>
                <h3 className="text-md font-semibold">Cooking Class</h3>
              </div>
            </div>
          </div>
        </section>
        */}
        <section>
          <div>
            <ActivitiesFeed />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeScreen;
