import { startAfter } from "firebase/database";
import { useDbData } from "../hooks/firebase.js";
import { getHostedActivities } from "../utils/activity.js";
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
  searchQuery,
}) => {
  const [data, error] = useDbData("/");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  // Get all activities without any native filtering.
  const allActivities = getHostedActivities(data, {});

  const isValidTimestamp = (timestamp) => {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(timestamp);
  };

  // Partition activities into accepted and rejected in a single pass
  const { accepted, rejected } = allActivities.reduce(
    (acc, activity) => {
      let okayDate = true;
      let okayStartTime = true;
      let okayEndTime = true;
      if (
        activity.eventTimestamp &&
        isValidTimestamp(activity.eventTimestamp)
      ) {
        const [eventDate, eventTime] = activity.eventTimestamp.split("T");

        let eventEndTime =
          activity.endEventTimestamp &&
          isValidTimestamp(activity.endEventTimestamp)
            ? activity.endEventTimestamp.split("T")[1]
            : null;

        okayStartTime = eventTime >= startTime;
        okayEndTime = eventEndTime ? eventEndTime <= endTime : true;
        okayDate = endDate
          ? eventDate >= startDate && eventDate <= endDate
          : eventDate >= startDate;
      }

      let matchesSearch = true;
      if (searchQuery && searchQuery != "") {
        matchesSearch =
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
      }

      const matchesLooking = activity.lookingFor
        ? activity.lookingFor === lookingFor
        : true;
      const okayGroupSize =
        typeof activity.groupSize === "number"
          ? activity.groupSize <= maxGroupSize
          : true;
      const okayDistance = true; // placeholder for distance filtering

      const passesFilters =
        matchesLooking &&
        okayStartTime &&
        okayEndTime &&
        okayDate &&
        okayGroupSize &&
        okayDistance &&
        matchesSearch;

      if (passesFilters) {
        acc.accepted.push(activity);
      } else {
        acc.rejected.push(activity);
      }
      return acc;
    },
    { accepted: [], rejected: [] },
  );

  // Sorting function; you can expand for "Distance" or "Popularity" later
  const sortFunction = (a, b) => {
    if (sortBy === "Start Time") {
      return new Date(a.eventTimestamp) - new Date(b.eventTimestamp);
    } else if (sortBy === "Popularity") {
      const aCount = a.interested ? a.interested.length : 0;
      const bCount = b.interested ? b.interested.length : 0;
      return aCount - bCount;
    }
    // Default to sorting by start time
    return new Date(a.eventTimestamp) - new Date(b.eventTimestamp);
  };

  const sortedAccepted = [...accepted].sort(sortFunction);
  const sortedRejected = [...rejected].sort(sortFunction);

  return (
    <section>
      <div className="text-left my-5">
        <strong>Filtered Results</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedAccepted.map((activity, idx) => (
          <Activity key={`accepted-${idx}`} activity={activity} />
        ))}
      </div>
      <div className="text-left my-5">
        <strong>More results</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedRejected.map((activity, idx) => (
          <Activity key={`rejected-${idx}`} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesFeed;
