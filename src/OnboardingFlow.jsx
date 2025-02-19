import React, { useState } from "react";
import testImage from "../assets/testing.png";
import welcomeImage from "../assets/welcome.jpg";

const activities = [
  { id: "concert", name: "Going to concert" },
  { id: "museum", name: "Museum" },
  { id: "gym", name: "Gym buddy" },
  { id: "cooking", name: "Cooking ideas" },
  { id: "garden", name: "Visiting Botanic Garden" },
  { id: "bbq", name: "BBQ Grilling" },
  { id: "food", name: "Trying new food" },
  { id: "running", name: "Outdoor Run/Walks" },
  { id: "grocery", name: "Grocery Shopping" },
];

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleActivityToggle = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId],
    );
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div className="relative w-48 h-48 mx-auto mb-16 mt-16">
          <img
            src={welcomeImage}
            alt="City map illustration"
            width="600"
            height="600"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-center mb-4">
          Discover Activities
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Join nearby activities
        </p>
        <button
          onClick={() => setStep(2)}
          className="w-full py-4 px-6 bg-orange-500 text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Get started
        </button>
      </div>
    </div>
  );

  const renderActivitySelection = () => (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Choose activities you would like to do with others
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-20">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col items-center">
              <div
                className={`w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 mb-2 ${
                  selectedActivities.includes(activity.id)
                    ? "border-orange-500"
                    : "border-gray-200"
                }`}
                onClick={() => handleActivityToggle(activity.id)}
              >
                <img
                  src={testImage}
                  alt={activity.name}
                  width="100"
                  height="100"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-2 bg-gray-100 rounded-lg text-center w-full">
                <span className="text-sm font-medium">{activity.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() =>
                console.log("Selected activities:", selectedActivities)
              }
              className="w-full py-4 px-6 bg-orange-500 text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {step === 1 ? renderWelcomeScreen() : renderActivitySelection()}
    </div>
  );
};

export default OnboardingFlow;
