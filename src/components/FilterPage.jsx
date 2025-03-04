import { useState } from "react";

const FilterPage = ({
  onClose,
  sortBy,
  setSortBy,
  lookingFor,
  setLookingFor,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  maxGroupSize,
  setMaxGroupSize,
  maxDistance,
  setMaxDistance,
}) => {
  const toggleSortBy = (option) => setSortBy(option);
  const toggleLookingFor = (option) => setLookingFor(option);

  const buttonStyle = (selected) =>
    `px-4 py-2 border rounded-full transition-colors ${
      selected
        ? "bg-orange-500 text-white"
        : "bg-white text-orange-500 border-orange-500"
    } hover:bg-orange-600 hover:text-white`;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Filter Options</h2>
        <button
          onClick={onClose}
          className="text-orange-500 hover:text-orange-700 font-semibold"
        >
          Close
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Sort by</h3>
        <div className="flex gap-2 mt-2">
          {["Distance", "Start Time", "Popularity"].map((option) => (
            <button
              key={option}
              className={buttonStyle(sortBy === option)}
              onClick={() => toggleSortBy(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Looking for</h3>
        <div className="flex gap-2 mt-2">
          {["Friend", "Date", "Networking"].map((option) => (
            <button
              key={option}
              className={buttonStyle(lookingFor === option)}
              onClick={() => toggleLookingFor(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Max Group Size</h3>
        <div className="mt-2">
          <input
            type="number"
            min="1"
            value={maxGroupSize}
            onChange={(e) => setMaxGroupSize(parseInt(e.target.value, 10))}
            className="border p-2 rounded w-full"
            placeholder="Enter max group size"
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Event Time</h3>
        <div className="flex gap-4 mt-2">
          <div className="flex-1">
            <label className="block text-sm">Starts After</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm">Ends Before</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Event Date</h3>
        <div className="flex gap-4 mt-2">
          <div className="flex-1">
            <label className="block text-sm">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Max Distance</h3>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="range"
            min="1"
            max="100"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseInt(e.target.value, 10))}
            className="w-full accent-orange-500"
          />
          <span className="whitespace-nowrap">
            {maxDistance} mile{maxDistance === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-orange-500 text-white rounded-full text-lg font-semibold hover:bg-orange-600"
      >
        Filter
      </button>
    </div>
  );
};

export default FilterPage;
