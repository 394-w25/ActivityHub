import React, { useState } from "react";
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

  return (
    <div className="bg-white">{step === 1 ? renderWelcomeScreen() : null}</div>
  );
};

export default OnboardingFlow;
