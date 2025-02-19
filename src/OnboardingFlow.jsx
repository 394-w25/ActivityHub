import React, { useState } from "react";
import welcomeImage from "../assets/welcome.jpg";

const WelcomePage = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-64 h-64 mb-8">
          <img
            src={welcomeImage}
            alt="City map illustration"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">Discover Activities</h1>
        <p className="text-lg text-gray-600 mb-8">Join nearby activities</p>

        <button
          onClick={onGetStarted}
          className="w-full bg-[#E67E22] text-white py-3 px-6 rounded-lg text-lg"
        >
          Get started
        </button>
      </div>
    </div>
  );
};

const ActivityCard = ({ image, title, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg overflow-hidden ${
        selected ? "ring-2 ring-[#E67E22]" : ""
      }`}
    >
      <img src={image} alt={title} className="w-full h-32 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gray-200 bg-opacity-90 px-3 py-2">
        <p className="text-sm font-medium">{title}</p>
      </div>
    </div>
  );
};

const OnboardingPage = ({ onContinue }) => {
  const [selectedActivities, setSelectedActivities] = useState(new Set());

  const activities = [
    { id: 1, title: "Going to concert", image: "/api/placeholder/300/200" },
    { id: 2, title: "Museum", image: "/api/placeholder/300/200" },
    { id: 3, title: "Gym buddy", image: "/api/placeholder/300/200" },
    { id: 4, title: "Cooking ideas", image: "/api/placeholder/300/200" },
    {
      id: 5,
      title: "Visiting Botanic Garden",
      image: "/api/placeholder/300/200",
    },
    { id: 6, title: "BBQ Grilling", image: "/api/placeholder/300/200" },
    { id: 7, title: "Trying new food", image: "/api/placeholder/300/200" },
    { id: 8, title: "Outdoor Run/Walks", image: "/api/placeholder/300/200" },
    { id: 9, title: "Grocery Shopping", image: "/api/placeholder/300/200" },
  ];

  const toggleActivity = (id) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedActivities(newSelected);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">
          Choose activities you would like to do with others
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              image={activity.image}
              title={activity.title}
              selected={selectedActivities.has(activity.id)}
              onClick={() => toggleActivity(activity.id)}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onContinue}
          className="w-full bg-[#E67E22] text-white py-3 px-6 rounded-lg text-lg"
          disabled={selectedActivities.size === 0}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const OnboardingFlow = () => {
  const [currentPage, setCurrentPage] = useState("welcome");

  const handleGetStarted = () => {
    setCurrentPage("onboarding");
  };

  const handleContinue = () => {
    // Handle navigation to the main app
    console.log("Continue to main app");
  };

  return (
    <div className="h-screen">
      {currentPage === "welcome" ? (
        <WelcomePage onGetStarted={handleGetStarted} />
      ) : (
        <OnboardingPage onContinue={handleContinue} />
      )}
    </div>
  );
};

export default OnboardingFlow;
