import React, { useState } from "react";
import { signInWithGoogle } from "@hooks/firebase.js";
import welcomeImage from "@assets/welcome.jpg";
import googleIcon from "@assets/google.png";

// Import specific images for each activity
import concertImage from "@assets/concert.jpg";
import museumImage from "@assets/museum.jpg";
import gymImage from "@assets/gym.jpg";
import cookingImage from "@assets/cooking.jpg";
import gardenImage from "@assets/garden.jpg";
import bbqImage from "@assets/bbq.jpg";
import diningImage from "@assets/dining.jpg";
import outdoorImage from "@assets/outdoor.jpg";
import shoppingImage from "@assets/shopping.jpg";

const activities = [
  { id: "concert", name: "Concert", image: concertImage },
  { id: "museum", name: "Museum", image: museumImage },
  { id: "gym", name: "Gym", image: gymImage },
  { id: "cooking", name: "Cooking", image: cookingImage },
  { id: "garden", name: "Garden", image: gardenImage },
  { id: "bbq", name: "BBQ", image: bbqImage },
  { id: "dining", name: "Dining", image: diningImage },
  { id: "outdoor", name: "Outdoor", image: outdoorImage },
  { id: "shopping", name: "Shopping", image: shoppingImage },
];

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setStep(2);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

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
          onClick={handleGoogleSignIn}
          className="w-full py-4 px-6 bg-orange-500 text-white rounded-lg shadow-md transition flex items-center justify-center hover:bg-orange-600"
        >
          <img src={googleIcon} alt="Google icon" className="w-5 h-5 mr-2" />
          Continue with Google
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
          {activities.map((activity) => {
            const isSelected = selectedActivities.includes(activity.id);

            return (
              <div key={activity.id} className="flex flex-col items-center">
                <div
                  className={`w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 mb-2 transition-colors ${
                    isSelected ? "border-orange-500" : "border-gray-200"
                  }`}
                  onClick={() => handleActivityToggle(activity.id)}
                >
                  <img
                    src={activity.image}
                    alt={activity.name}
                    width="250"
                    height="150"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-center w-full">
                  <span className="text-sm font-medium">{activity.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={onComplete}
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
