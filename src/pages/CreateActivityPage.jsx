import React from "react";
import { useNavigate } from "react-router-dom";
import ActivityForm from "../components/ActivityForm";

const CreateActivityPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-orange-100 p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-crimson text-left mb-6">
          Create an Event
        </h1>
        <ActivityForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateActivityPage;
