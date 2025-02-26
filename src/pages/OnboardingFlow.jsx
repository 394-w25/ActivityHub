import React, { useState } from "react";
import { signInWithGoogle, useDbUpdate } from "@hooks/firebase.js";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { database } from "@/hooks/firebase";

// Images
import welcomeImage from "@assets/logo.png";
import googleIcon from "@assets/google.png";
import concertImage from "@assets/concert.jpg";
import museumImage from "@assets/museum.jpg";
import gymImage from "@assets/gym.jpg";
import cookingImage from "@assets/cooking.jpg";
import gardenImage from "@assets/garden.jpg";
import bbqImage from "@assets/bbq.jpg";
import diningImage from "@assets/dining.jpg";
import outdoorImage from "@assets/outdoor.jpg";
import shoppingImage from "@assets/shopping.jpg";

// List of activities with image
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

const OnboardingFlow = () => {
  // Step 1 = Google Sign-In, Step 2 = Personal Info, Step 3 = Activities
  const [step, setStep] = useState(1);

  // Personal info states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");

  // Error message for personal info step
  const [formError, setFormError] = useState("");

  // Activities
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Hook to update Realtime Database at /users
  const [updateData, updateResult] = useDbUpdate("/users");

  const navigate = useNavigate();
  const auth = getAuth(); // to get the current signed-in user

  // ------------------ STEP 1: Google Sign-In ------------------
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      const user = auth.currentUser;

      if (!user) {
        console.error("Google sign-in failed, no user found.");
        return;
      }

      setStep(2);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // ------------------ STEP 2: Personal Info -------------------
  const handleAgeChange = (e) => {
    const val = e.target.value;

    if (val === "" || parseInt(val, 10) >= 1) {
      setAge(val);
    }
  };

  const handlePersonalInfoSubmit = () => {
    setFormError("");

    // Validate fields
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !gender ||
      !age ||
      parseInt(age, 10) < 1 ||
      !location.trim()
    ) {
      setFormError(
        "All fields are required, and age must be a positive integer.",
      );
      return;
    }

    // If all fields are valid, proceed to Step 3
    setStep(3);
  };

  // ------------------ STEP 3: Activity Selection --------------
  const handleActivityToggle = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId],
    );
  };

  // ------------------ FINAL: Store Info & Navigate ------------
  const handleContinue = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is signed in, cannot store data.");
      return;
    }

    try {
      const updatedData = {
        firstName,
        lastName,
        gender,
        age: parseInt(age, 10),
        location,
        selectedActivities,
      };

      await updateData(`/users/${user.uid}`, updatedData);

      navigate("/home");
    } catch (error) {
      console.error("Error udpating user data:", error);
    }
  };

  // ------------------ Renders ------------------

  // STEP 1: Welcome + Google Sign-In
  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div className="relative w-60 h-60 mx-auto mb-8 mt-8">
          <img
            src={welcomeImage}
            alt="Logo"
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

  // STEP 2: Personal Info Form
  const renderPersonalInfoScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Tell us about you
        </h2>

        {/* Error (if any) */}
        {formError && <p className="text-red-500 text-center">{formError}</p>}

        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g., John"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g., Doe"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
            <option value="preferNotToSay">Prefer not to say</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={age}
            onChange={handleAgeChange}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g., 25"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g., New York"
          />
        </div>

        {/* Next button */}
        <button
          onClick={handlePersonalInfoSubmit}
          className="w-full mt-4 py-3 px-6 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  // STEP 3: Activity Selection
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
              onClick={handleContinue}
              className="w-full py-4 px-6 bg-orange-500 text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ------------------ Return ------------------
  return (
    <div className="bg-white">
      {step === 1 && renderWelcomeScreen()}
      {step === 2 && renderPersonalInfoScreen()}
      {step === 3 && renderActivitySelection()}
    </div>
  );
};

export default OnboardingFlow;
