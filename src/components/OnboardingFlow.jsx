import React, { useState } from "react";
import { signInWithGoogle, useDbUpdate } from "@hooks/firebase.js";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { database } from "@/hooks/firebase";

// Images/icons for the welcome page only:
import welcomeImage from "@assets/logo.png";
import googleIcon from "@assets/google.png";

// New icons for location & notifications
import locationIcon from "@assets/location_icon.png";
import notificationIcon from "@assets/notification_icon.png";

// A simple list of interest names (no images)
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
  /*
    Steps:
      1 = Google Sign-In
      2 = Personal Info
      3 = Location Permission
      4 = Interest Selection
      5 = Notification Permission
  */
  const [step, setStep] = useState(1);

  // Basic user info
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(""); // e.g., "YYYY-MM-DD"
  const [location, setLocation] = useState("");

  // Permissions
  const [locationPermission, setLocationPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  // Interests (array of selected interests)
  const [interests, setInterests] = useState([]);

  // Error handling for personal info
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();
  const [updateData] = useDbUpdate("/users");

  // --------------- STEP 1: Google Sign-In --------------------
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      const user = auth.currentUser;
      if (!user) {
        console.error("Google sign-in failed. No user found.");
        return;
      }
      setStep(2);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // --------------- STEP 2: Personal Info ----------------------
  const handlePersonalInfoSubmit = () => {
    setFormError("");

    if (!name.trim() || !gender || !dob || !location.trim()) {
      setFormError("All fields are required. Please fill them out.");
      return;
    }

    setStep(3); // Next to Location Permission
  };

  // --------------- STEP 3: Location Permission ---------------
  const handleEnableLocation = () => {
    // Example: request real geolocation if desired
    setLocationPermission(true);
    setStep(4);
  };

  const renderLocationPermissionScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <h2 className="text-3xl font-bold mb-2">Allow Location</h2>
        <p className="text-gray-600 mb-8">
          We use your location to find nearby events and matches.
        </p>
        <div className="mx-auto mb-6">
          <img
            src={locationIcon}
            alt="Location icon"
            className="h-24 w-24 mx-auto"
          />
        </div>
        <button
          onClick={handleEnableLocation}
          className="w-full py-3 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600"
        >
          Enable Location
        </button>
      </div>
    </div>
  );

  // --------------- STEP 4: Interest Selection ----------------
  const handleInterestToggle = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  const handleSkipInterests = () => {
    // If user wants to skip picking interests
    setInterests([]);
    setStep(5);
  };

  const handleBackFromInterests = () => {
    setStep(3);
  };

  const handleContinueFromInterests = () => {
    setStep(5);
  };

  const renderInterestSelection = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      {/* A card-like container for top section */}
      <div className="w-full max-w-xl bg-white">
        <div className="flex justify-between items-center mb-6">
          {/* Back arrow */}
          <button
            onClick={handleBackFromInterests}
            className="text-orange-500 hover:underline text-2xl"
          >
            &larr;
          </button>
          {/* Skip */}
          <button
            onClick={handleSkipInterests}
            className="text-orange-500 hover:underline"
          >
            Skip
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center">Your interests</h2>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Select a few of your interests and let everyone know what you’re
          passionate about.
        </p>

        {/* 2-column grid for the interest “pills” */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {allInterests.map((interest) => {
            const isSelected = interests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`w-full px-4 py-2 rounded-full border text-center transition
                  ${
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

      {/* Bottom “Continue” button */}
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

  // --------------- STEP 5: Notification Permission -----------
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
        {/* "Skip" in top-right */}
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
          Get a push notification when you match or receive a message.
        </p>
        <div className="mx-auto mb-6">
          <img
            src={notificationIcon}
            alt="Notification icon"
            className="h-24 w-24 mx-auto"
          />
        </div>
        <button
          onClick={handleEnableNotifications}
          className="w-full py-3 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600"
        >
          I want to be notified
        </button>
      </div>
    </div>
  );

  // --------------- Final DB Update & Navigation --------------
  const handleFinish = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is signed in, cannot store data.");
      return;
    }
    try {
      // Example data shape matching your schema:
      const updatedData = {
        name,
        gender,
        dob,
        location,
        interests,
        permissions: {
          location: locationPermission,
          notifications: notificationPermission,
        },
      };

      // Write to /users/<user.uid> in your Realtime DB
      await updateData(`/users/${user.uid}`, updatedData);
      navigate("/home");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // --------------- Renders by Step ---------------------------
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

  const renderPersonalInfoScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Tell us about you
        </h2>

        {formError && <p className="text-red-500 text-center">{formError}</p>}

        {/* Name */}
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

        {/* Date of Birth */}
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

        <button
          onClick={handlePersonalInfoSubmit}
          className="w-full mt-4 py-3 px-6 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  // ------------------ Return (Step-by-step) ------------------
  return (
    <div className="bg-white">
      {step === 1 && renderWelcomeScreen()}
      {step === 2 && renderPersonalInfoScreen()}
      {step === 3 && renderLocationPermissionScreen()}
      {step === 4 && renderInterestSelection()}
      {step === 5 && renderNotificationPermissionScreen()}
    </div>
  );
};

export default OnboardingFlow;
