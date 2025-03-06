// src/components/onboarding/PersonalInfoForm.jsx
import React from "react";

const PersonalInfoForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  gender,
  setGender,
  age,
  setAge,
  location,
  setLocation,
  onSubmit,
  formError,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Tell us about you
        </h2>
        {formError && <p className="text-red-500 text-center">{formError}</p>}
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
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="e.g., 25"
          />
        </div>
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
          onClick={onSubmit}
          className="w-full mt-4 py-3 px-6 bg-orange-500 text-white rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
