import React from "react";
import ActivityForm from "../components/ActivityForm";

const CreateActivityPage = () => {
  const handleSuccess = () => {
    console.log("Activity posted successfully");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Activity</h1>
      <ActivityForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateActivityPage;
