import React from "react";

const ActivityDetails = ({ activity }) => {
  return (
    <div className="relative w-full h-full p-4 bg-gray-900 text-white">
      <div className="mb-4 text-lg font-semibold">Activity Details</div>

      <div className="max-w-sm mx-auto bg-white text-black rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 space-y-4">
          {/* Header: Title, Time & Location */}
          <div className="p-0">
            <h2 className="text-2xl font-bold">
              {activity.title || "Yoga in the Park"}
            </h2>
            <p className="mt-1">
              {activity.dateTime || "Saturday, 10:00 AM"} <br />
              {activity.location || "Central Park, NYC"}
            </p>
          </div>

          {/* Creator info and Join button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Created by Sarah Thompson</p>
            <button className="py-1 px-3 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors">
              Join Activity
            </button>
          </div>

          <hr className="border-gray-300" />

          {/* Description */}
          <p className="text-sm text-gray-600">
            Join us for a relaxing yoga session in Central Park. All levels are
            welcome. Bring your mat and water bottle.
          </p>

          {/* Group Details */}
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Group Details</h3>
            <p className="text-sm text-gray-600">Group Size: 20 people</p>
            <p className="text-sm text-gray-600">
              Interests: Health, Wellness, Community
            </p>
          </div>

          <hr className="border-gray-300" />

          {/* Safety & Trust */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Safety &amp; Trust</h3>
            <div className="flex items-center gap-2">
              <span className="inline-block border border-gray-500 text-xs px-2 py-1 rounded">
                Phone Verified
              </span>
              <span className="inline-block border border-gray-500 text-xs px-2 py-1 rounded">
                Email Verified
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <p>Reviews:</p>
              <p>“A wonderful experience, highly recommend!” — Emily R.</p>
            </div>
          </div>

          {/* Footer: Chat with Creator button */}
          <div className="pt-2">
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Chat with Creator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
