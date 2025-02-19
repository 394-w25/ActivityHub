import React, { useState } from "react";
import OnboardingFlow from "./components/OnboardingFlow"; // adjust path if needed
import Activity from "@components/Activity"; // adjust path if needed
import HomeScreen from "@components/HomeScreen";

// Dummy data for testing multiple activities
const dummyActivities = [
  {
    id: "yoga",
    timestamp: Date.now(),
    title: "Yoga in the Park",
    location: "Central Park, NYC",
    description:
      "Join us for a relaxing yoga session in Central Park. All levels are welcome. Bring your mat and water bottle.",
  },
  {
    id: "hiking",
    timestamp: Date.now() + 3600000,
    title: "Morning Hike",
    location: "Blue Ridge Mountains",
    description:
      "Explore scenic trails and enjoy breathtaking views on this beginner-friendly morning hike.",
  },
  {
    id: "coding",
    timestamp: Date.now() + 7200000,
    title: "Hackathon Meetup",
    location: "Tech Hub Downtown",
    description:
      "Meet fellow developers and collaborate on exciting projects at our weekend hackathon.",
  },
  {
    id: "cooking",
    timestamp: Date.now() + 10800000,
    title: "Italian Cooking Class",
    location: "Community Kitchen",
    description:
      "Learn to make homemade pasta and classic Italian dishes in this hands-on cooking class.",
  },
];

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  return (
    <div className="App">
      <div className="p-4">
        <button
          className="mb-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => setShowOnboarding((prev) => !prev)}
        >
          Toggle Test View
        </button>
        {showOnboarding ? (
          hasCompletedOnboarding ? (
            <HomeScreen />
          ) : (
            <OnboardingFlow
              onComplete={() => setHasCompletedOnboarding(true)}
            />
          )
        ) : (
          <div className="max-w-md mx-auto h-screen overflow-y-auto space-y-4 p-4 bg-gray-100 rounded-lg shadow-lg">
            {dummyActivities.map((activity) => (
              <Activity key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
