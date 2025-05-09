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
  selectedCategories,
  setSelectedCategories,
}) => {
  const categories = [
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
    "Video Games",
  ];
  const [showCategories, setShowCategories] = useState(false);

  const toggleSortBy = (option) => setSortBy(option);
  const toggleLookingFor = (option) => {
    setLookingFor((prev) => (prev === option ? null : option));
  };

  const toggleCategoryDropdown = () => {
    setShowCategories(!showCategories);
  };

  const selectCategory = (category) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // Remove if already selected
          : [...prev, category], // Add if not selected
    );
  };

  const buttonStyle = (selected) =>
    `px-4 py-2 border rounded-full transition-colors text-sm md:text-base ${
      selected
        ? "bg-orange-500 text-white"
        : "bg-white text-orange-500 border-orange-500"
    } hover:bg-orange-600 hover:text-white`;

  return (
    <div className="p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Filter Options</h2>
        <button
          onClick={onClose}
          className="text-orange-500 hover:text-orange-700 font-semibold"
        >
          Close
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Sort by</h3>
        <div className="flex flex-wrap gap-2 mt-2">
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
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            "Friendship",
            "Dating",
            "Meetup",
            "Networking",
            "Group Activity",
            "Other",
          ].map((option) => (
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
        <h3 className="text-lg font-semibold">Category</h3>
        <div className="relative">
          <div
            className="border p-2 rounded w-full cursor-pointer bg-white text-black flex items-center justify-between"
            onClick={toggleCategoryDropdown}
          >
            <span>
              {selectedCategories.length > 0
                ? selectedCategories.join(", ") // Show multiple selected categories
                : "Select categories"}
            </span>

            <span className="text-gray-500">▼</span>
          </div>

          {showCategories && (
            <div className="absolute w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-60 overflow-y-auto z-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`block w-full text-left px-4 py-2 hover:bg-orange-100 ${
                    selectedCategories.includes(category)
                      ? "bg-orange-400 text-white"
                      : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Max Group Size</h3>
        <input
          type="number"
          min="1"
          value={maxGroupSize}
          onChange={(e) => setMaxGroupSize(parseInt(e.target.value, 10))}
          className="border p-2 rounded w-full"
          placeholder="Enter max group size"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Event Time</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm">Starts After</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
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
          <span className="whitespace-nowrap text-sm md:text-base">
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
