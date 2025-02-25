import { useDbData } from "../hooks/firebase.js";
import { getActivities } from "../utils/activity.js";
import Activity from "./Activity.jsx";

const ActivitiesFeed = ({ filters }) => {
  const [data, error] = useDbData("/");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  const { groupSize, location, startTime, endTime } = filters;

  // Pass the filters as functions to getActivities.
  // This uses the native filtering functionality of getActivities.
  const filteredActivities = getActivities(data, {
    userFilter: (userID) => true, // No user-level filtering for now
    activityFilter: (activity) => {
      // Filter by maxPeople if defined
      if (groupSize && activity.groupSize > groupSize) return false;

      // Filter by timeframe if both startTime and endTime are provided
      if (startTime && endTime) {
        if (
          activity.eventTimestamp < startTime ||
          activity.eventTimestamp > endTime
        ) {
          return false;
        }
      }

      // Location filtering placeholder (to be implemented as needed)
      if (location) {
        // TODO: implement proper location filtering logic here.
      }

      return true;
    },
  });

  // Sort the activities by eventTimestamp (ascending)
  const sortedActivities = filteredActivities.sort((a, b) => {
    return a[1].eventTimestamp - b[1].eventTimestamp;
  });

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Nearby Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedActivities.map((activity, idx) => (
          <Activity key={idx} activity={activity[1]} />
        ))}
      </div>
    </section>
  );
};

/* ActivitiesFeed.propTypes = {
  filters: PropTypes.shape({
    maxPeople: PropTypes.number,
    location: PropTypes.string,
    startTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    endTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
  }).isRequired,
}; */

export default ActivitiesFeed;
