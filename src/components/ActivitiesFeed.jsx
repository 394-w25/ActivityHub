import { startAfter } from "firebase/database";
import { useDbData } from "../hooks/firebase.js";
import { getActivities } from "../utils/activity.js";
import Activity from "./Activity.jsx";

const ActivitiesFeed = ({
  sortBy = "Start Time",
  lookingFor,
  startTime,
  endTime,
  startDate,
  endDate,
  maxGroupSize,
  maxDistance,
}) => {
  const [data, error] = useDbData("/");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  const allActivities = getActivities(data, {});

  // may not be needed because the filter is already handled in getActivities (thanks Darin)
  const filteredActivities = allActivities.filter((request) => {
    // Ensure eventTimestamp exists
    if (!request.eventTimestamp) return false;

    // Extract date and time from eventTimestamp (format: "YYYY-MM-DDTHH:mm")
    const [eventDate, eventTime] = request.eventTimestamp.split("T");

    // If there's an endEventTimestamp, extract its time part; otherwise, default to null.
    let eventEndTime = null;
    if (request.endEventTimestamp) {
      const parts = request.endEventTimestamp.split("T");
      eventEndTime = parts[1] || null;
    }

    // Handle "lookingFor" filter:
    // If the filter value is provided, the activity must match; if not provided, pass it.
    const matchesLooking = request.lookingFor
      ? request.lookingFor === lookingFor
      : true;

    // Compare times. If the activity doesn't have an endEventTimestamp, we only check the start time.
    // String comparisons in "HH:mm" format work correctly.
    const okayStartTime = eventTime >= startTime;
    const okayEndTime = request.endEventTimestamp
      ? eventEndTime
        ? eventEndTime <= endTime
        : false
      : true;

    const okayDate = true;
    // Compare dates (assuming startDate and endDate are in "YYYY-MM-DD" format)
    if (endDate != "") {
      const okayDate = eventDate >= startDate && eventDate <= endDate;
    } else {
      const okayDate = eventDate >= startDate;
    }

    // Check max group size; if groupSize isn’t provided, assume it's valid.
    const okayGroupSize =
      typeof request.groupSize === "number"
        ? request.groupSize <= maxGroupSize
        : true;

    // Placeholder for distance filtering (to be implemented)
    const okayDistance = true;

    console.log(
      matchesLooking,
      okayStartTime,
      okayEndTime,
      okayDate,
      okayGroupSize,
      okayDistance,
    );

    console.log("Date: " + request.eventTimestamp);

    return (
      matchesLooking &&
      okayStartTime &&
      okayEndTime &&
      okayDate &&
      okayGroupSize &&
      okayDistance
    );
  });

  // we want to sort by whatever the user gave us. there are three sort options:
  // start time (ascending)
  // distance (ascending)
  // popularity (ascending)
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return a["eventTimestamp"] - b["eventTimestamp"];
    if (sortBy === "Distance") {
      // calculate distance from me and put lowest first. do later
    } else if (sortBy === "Popularity") {
      if (a["interested"] && b["interested"]) {
        return a["interested"].length - b["interested"].length;
      } else {
        return 1;
      }
    } else if (sortBy === "Start Time") {
      return a["eventTimestamp"] - b["eventTimestamp"];
    }
    return 1;
  });

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((activity, idx) => (
          <Activity key={idx} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesFeed;
