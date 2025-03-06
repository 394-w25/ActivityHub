// src/components/onboarding/ActivitySelection.jsx
import React from "react";

const ActivitySelection = ({
  activities,
  selectedActivities,
  onToggle,
  onContinue,
}) => {
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Choose activities you would like to do with others
        </h2>
        <div className="grid grid-cols-3 gap-6 mb-20">
          {activities.map((activity) => {
            const isSelected = selectedActivities.includes(activity.id);
            return (
              <div key={activity.id} className="flex flex-col items-center">
                <div
                  className={`w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 mb-2 transition-colors ${isSelected ? "border-orange-500" : "border-gray-200"}`}
                  onClick={() => onToggle(activity.id)}
                >
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-center w-full">
                  <span className="text-sm font-medium">{activity.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={onContinue}
              className="w-full py-4 px-6 bg-orange-500 text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelection;
