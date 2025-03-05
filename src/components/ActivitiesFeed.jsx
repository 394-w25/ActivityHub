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

  const isValidTimestamp = (timestamp) => {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(timestamp);
  };

  const filteredActivities = allActivities.filter((request) => {
    let okayDate = true;
    let okayStartTime = true;
    let okayEndTime = true;

    if (request.eventTimestamp && isValidTimestamp(request.eventTimestamp)) {
      const [eventDate, eventTime] = request.eventTimestamp.split("T");

      let eventEndTime = null;
      if (
        request.endEventTimestamp &&
        isValidTimestamp(request.endEventTimestamp)
      ) {
        eventEndTime = request.endEventTimestamp.split("T")[1];
      }

      okayStartTime = eventTime >= startTime;
      okayEndTime = eventEndTime ? eventEndTime <= endTime : true;

      okayDate = eventDate >= startDate;
      if (endDate) {
        okayDate = eventDate >= startDate && eventDate <= endDate;
      }
    }

    // Handle "lookingFor" filter
    const matchesLooking = request.lookingFor
      ? request.lookingFor === lookingFor
      : true;

    // Group size check
    const okayGroupSize =
      typeof request.groupSize === "number"
        ? request.groupSize <= maxGroupSize
        : true;

    // Placeholder for distance filtering
    const okayDistance = true;

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
