import React, { useState } from "react";

const FiltersModal = ({ onClose, onApply }) => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onApply(selectedFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Select Filters</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="fitness">Fitness</option>
            <option value="art">Art</option>
            <option value="cooking">Cooking</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
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
