import React, { useState } from "react";

const FiltersModal = ({ onClose, onApply }) => {
  const [filters, setFilters] = useState({
    startTimeFrom: "",
    startTimeTo: "",
    duration: "",
    maxGroupSize: "",
    maxDistance: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Filter Activities</h2>

        <label className="block mb-2">Start Time:</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">From</label>
            <input
              type="time"
              name="startTimeFrom"
              value={filters.startTimeFrom}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">To</label>
            <input
              type="time"
              name="startTimeTo"
              value={filters.startTimeTo}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
          </div>
        </div>

        <label className="block mb-2">Duration (hours):</label>
        <input
          type="number"
          name="duration"
          value={filters.duration}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-4"
          min="1"
        />

        <label className="block mb-2">Maximum Group Size:</label>
        <input
          type="number"
          name="maxGroupSize"
          value={filters.maxGroupSize}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-4"
          min="1"
        />

        <label className="block mb-2">Maximum Distance (miles):</label>
        <input
          type="number"
          name="maxDistance"
          value={filters.maxDistance}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mb-4"
          min="1"
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(filters)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
