import { useDbData } from "../../utilities/firebase.js";
import { getActivities } from "../../utilities/activity.js";
import Activity from "./Activity.jsx";

const ActivitiesFeed = ({}) => {
  const [data, error] = useDbData("/");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  const allActivities = getActivities(data, {});

  // this is where, in the future, we will put the filtering of activities.
  // some baseline filtering is required regardless of user input, such as
  // activities that have already passed. it may be good to remove those from
  // the database as well?
  const filteredActivities = allActivities.filter((request) => {
    return true;
  });

  // sort the posts for display
  // in the future we will likely sort these based on distance, as well as
  // discounting posts that are older than a certain time frame, as well as
  // taking posts out that are after the timeframe on the post
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return a["timestamp"] - b["timestamp"];
  });

  return (
    <div className="flex flex-col flex-1">
      <h1 className="font-lato text-start text-2xl font-bold py-4">Home</h1>

      {/* Filtered Posts */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredActivities.map((activity, idx) => (
          <Activity key={idx} activity={activity} />
        ))}
      </section>
    </div>
  );
};

export default ActivitiesFeed;
