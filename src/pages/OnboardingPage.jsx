import React, { useState } from "react";
import { useDbUpdate } from "@/hooks/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PersonalInfoForm from "@/components/onboarding/PersonalInfoForm";
import ActivitySelection from "@/components/onboarding/ActivitySelection";

const activities = [
  { id: "concert", name: "Concert", image: "/assets/concert.jpg" },
  { id: "museum", name: "Museum", image: "/assets/museum.jpg" },
  { id: "gym", name: "Gym", image: "/assets/gym.jpg" },
  { id: "cooking", name: "Cooking", image: "/assets/cooking.jpg" },
  { id: "garden", name: "Garden", image: "/assets/garden.jpg" },
  { id: "bbq", name: "BBQ", image: "/assets/bbq.jpg" },
  { id: "dining", name: "Dining", image: "/assets/dining.jpg" },
  { id: "outdoor", name: "Outdoor", image: "/assets/outdoor.jpg" },
  { id: "shopping", name: "Shopping", image: "/assets/shopping.jpg" },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  // Personal info states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [formError, setFormError] = useState("");
  // Activities
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [updateData] = useDbUpdate("/users");
  const navigate = useNavigate();
  const auth = getAuth();

  const handlePersonalInfoSubmit = () => {
    setFormError("");
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
    setStep(2);
  };

  const handleActivityToggle = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId],
    );
  };

  const handleOnboardingContinue = async () => {
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
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="bg-white">
      {step === 1 && (
        <PersonalInfoForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          gender={gender}
          setGender={setGender}
          age={age}
          setAge={setAge}
          location={location}
          setLocation={setLocation}
          onSubmit={handlePersonalInfoSubmit}
          formError={formError}
        />
      )}
      {step === 2 && (
        <ActivitySelection
          activities={activities}
          selectedActivities={selectedActivities}
          onToggle={handleActivityToggle}
          onContinue={handleOnboardingContinue}
        />
      )}
    </div>
  );
};

export default OnboardingPage;
