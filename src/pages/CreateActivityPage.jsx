import React from "react";
import { useNavigate } from "react-router-dom";
import ActivityForm from "../components/ActivityForm";

const CreateActivityPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    console.log("Activity posted successfully");
    navigate("/home"); // Redirect to home on success
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Activity</h1>
      <ActivityForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateActivityPage;
