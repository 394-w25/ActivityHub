import { useDbData } from "../hooks/firebase.js";
import { getActivities } from "../utils/activity.js";
import Activity from "./Activity.jsx";

const ActivitiesFeed = ({}) => {
  const [data, error] = useDbData("/");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  const allActivities = getActivities(data, {});

  // may not be needed because the filter is already handled in getActivities (thanks Darin)
  const filteredActivities = allActivities.filter((request) => {
    return true;
  });

  // sort the posts for display
  // in the future we will likely sort these based on distance, as well as
  // discounting posts that are older than a certain time frame, as well as
  // taking posts out that are after the timeframe on the post
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return a["eventTimestamp"] - b["eventTimestamp"];
  });

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Nearby Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((activity, idx) => (
          <Activity key={idx} activity={activity[1]} />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesFeed;
