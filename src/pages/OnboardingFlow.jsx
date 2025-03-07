import React, { useState, useEffect } from "react";
import { useAuthState, useDbUpdate } from "@/hooks/firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ref, get } from "firebase/database";
import { database } from "@/hooks/firebase";

// List of interests (you can update these as needed)
const allInterests = [
  "Photography",
  "Shopping",
  "Karaoke",
  "Wellness",
  "Cooking",
  "Sports",
  "Outdoor",
  "Swimming",
  "Art & Culture",
  "Traveling",
  "Adventure",
  "Music",
  "Food & Drink",
  "Video games",
];

const OnboardingFlow = () => {
  // Steps:
  // 1 = Personal Info
  // 2 = Location Permission
  // 3 = Interest Selection
  // 4 = Notification Permission
  const [step, setStep] = useState(1);

  // Personal info states (Step 1)
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [locationText, setLocationText] = useState("");

  // Permissions (Steps 2 and 4)
  const [locationPermission, setLocationPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  // Interests (Step 3)
  const [interests, setInterests] = useState([]);

  // Error handling for personal info
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading] = useAuthState();
  const [updateData] = useDbUpdate(user ? `/users/${user.uid}` : null);

  // Optional: Check if the user has already completed onboarding.
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists() && snapshot.val().onboardingComplete) {
          navigate("/home");
        }
      }
    };
    checkOnboardingStatus();
  }, [auth, navigate]);

  // ------------------ STEP 1: Personal Info ----------------------
  const handlePersonalInfoSubmit = () => {
    setFormError("");
    if (!name.trim() || !gender || !dob || !locationText.trim()) {
      setFormError("All fields are required. Please fill them out.");
      return;
    }
    setStep(2); // Move to Location Permission
  };

  const renderPersonalInfoScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Tell us about you
        </h2>
        {formError && <p className="text-red-500 text-center">{formError}</p>}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g., John Doe"
          />
        </div>
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
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g., New York"
          />
        </div>
        <button
          onClick={handlePersonalInfoSubmit}
          className="w-full mt-4 py-3 px-6 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  // ------------------ STEP 2: Location Permission ------------------
  const handleEnableLocation = () => {
    // Optionally request geolocation
    setLocationPermission(true);
    setStep(3);
  };

  const renderLocationPermissionScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <h2 className="text-3xl font-bold mb-2">Allow Location</h2>
        <p className="text-gray-600 mb-8">
          We use your location to find nearby events and matches.
        </p>
        <button
          onClick={handleEnableLocation}
          className="w-full py-3 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600"
        >
          Enable Location
        </button>
      </div>
    </div>
  );

  // ------------------ STEP 3: Interest Selection --------------------
  const handleInterestToggle = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSkipInterests = () => {
    setInterests([]);
    setStep(4);
  };

  const handleBackFromInterests = () => {
    setStep(2);
  };

  const handleContinueFromInterests = () => {
    setStep(4);
  };

  const renderInterestSelection = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-xl bg-white">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackFromInterests}
            className="text-orange-500 hover:underline text-2xl"
          >
            &larr;
          </button>
          <button
            onClick={handleSkipInterests}
            className="text-orange-500 hover:underline"
          >
            Skip
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center">Your interests</h2>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Select a few of your interests.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {allInterests.map((interest) => {
            const isSelected = interests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`w-full px-4 py-2 rounded-full border text-center transition ${
                  isSelected
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-full max-w-xl">
        <button
          onClick={handleContinueFromInterests}
          className="w-full py-4 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600"
        >
          Continue
        </button>
      </div>
    </div>
  );

  // ------------------ STEP 4: Notification Permission ----------------
  const handleSkipNotifications = () => {
    setNotificationPermission(false);
    handleFinish();
  };

  const handleEnableNotifications = () => {
    setNotificationPermission(true);
    handleFinish();
  };

  const renderNotificationPermissionScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="text-right">
          <button
            onClick={handleSkipNotifications}
            className="text-orange-500 hover:underline"
          >
            Skip
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-2">Enable Notifications</h2>
        <p className="text-gray-600">
          Get notified when you match or receive a message.
        </p>
        <button
          onClick={handleEnableNotifications}
          className="w-full py-3 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600"
        >
          I want to be notified
        </button>
      </div>
    </div>
  );

  // ------------------ Final DB Update & Navigation ----------------
  const handleFinish = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is signed in, cannot store data.");
      return;
    }
    try {
      const updatedData = {
        name,
        gender,
        dob,
        location: locationText,
        interests,
        permissions: {
          location: locationPermission,
          notifications: notificationPermission,
        },
        onboardingComplete: true,
      };
      await updateData(updatedData); // `/users/${user.uid}`,
      navigate("/home");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // ------------------ Render Based on Step ----------------
  return (
    <div className="bg-white">
      {step === 1 && renderPersonalInfoScreen()}
      {step === 2 && renderLocationPermissionScreen()}
      {step === 3 && renderInterestSelection()}
      {step === 4 && renderNotificationPermissionScreen()}
    </div>
  );
};

export default OnboardingFlow;
