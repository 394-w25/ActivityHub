import { useDbData } from "../hooks/firebase.js";
import { getHostedActivities } from "../utils/activity.js";
import Activity from "./Activity.jsx";

const ActivitiesFeed = ({ filters }) => {
  const [data, error] = useDbData("/");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  // Get all activities without any native filtering.
  const allActivities = getHostedActivities(data, {});

  const { startTimeFrom, startTimeTo, maxDuration, maxGroupSize, maxDistance } =
    filters;

  // Filter activities using a similar approach to the Posts component.
  const filteredActivities = allActivities.filter((activity) => {
    // Extract just the time portion from the event timestamp
    const eventTime = activity.eventTimestamp.split("T")[1];

    // Compare just the time portions
    if (startTimeFrom && eventTime < startTimeFrom) {
      return false;
    }

    if (startTimeTo && eventTime > startTimeTo) {
      return false;
    }

    if (activity.duration) {
      if (maxDuration && Number(activity.duration) > Number(maxDuration)) {
        return false;
      }
    }

    // Filter by maximum group size.
    if (maxGroupSize && Number(activity.groupSize) > Number(maxGroupSize)) {
      return false;
    }

    if (activity.distance) {
      if (maxDistance && Number(activity.distance) > Number(maxDistance)) {
        return false;
      }
    }

    return true;
  });

  // Sort the filtered activities by eventTimestamp (ascending order).
  const sortedActivities = [...filteredActivities].sort(
    (a, b) => a.eventTimestamp - b.eventTimestamp,
  );

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Nearby Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedActivities.map((activity, idx) => (
          <Activity key={idx} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesFeed;
