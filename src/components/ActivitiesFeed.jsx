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
  categories,
  userLocation,
}) => {
  const [data, error] = useDbData("/users");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  const allActivities = getHostedActivities(data, {});

  const isValidTimestamp = (timestamp) => {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(timestamp);
  };

  const getDistance = (userLocation, activityCoords) => {
    if (
      !userLocation ||
      !activityCoords ||
      !activityCoords.latitude ||
      !activityCoords.longitude
    )
      return Infinity;

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8;

    const dLat = toRad(activityCoords.latitude - userLocation[0]);
    const dLon = toRad(activityCoords.longitude - userLocation[1]);

    const lat1 = toRad(userLocation[0]);
    const lat2 = toRad(activityCoords.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const { accepted, rejected } = allActivities.reduce(
    (acc, activity) => {
      let okayDate = true;
      let okayStartTime = true;
      let okayEndTime = true;

      if (
        activity.eventStartTimestamp &&
        isValidTimestamp(activity.eventStartTimestamp)
      ) {
        const [eventDate, eventTime] = activity.eventStartTimestamp.split("T");

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
      if (searchQuery && searchQuery !== "") {
        matchesSearch =
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (activity.description &&
            activity.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));
      }

      const matchesLooking =
        lookingFor !== null && lookingFor !== undefined
          ? activity.lookingFor !== undefined &&
            activity.lookingFor === lookingFor
          : true;

      const matchesCategories =
        categories.length > 0
          ? Array.isArray(activity.tags) &&
            activity.tags.some((tag) => categories.includes(tag))
          : true;

      const okayGroupSize =
        typeof activity.groupSize === "number"
          ? activity.groupSize <= maxGroupSize
          : true;

      let okayDistance = true;

      if (!userLocation) {
        okayDistance = true;
      } else if (!maxDistance) {
        okayDistance = true;
      } else if (
        !activity.coords ||
        !activity.coords.latitude ||
        !activity.coords.longitude
      ) {
        okayDistance = false;
      } else {
        okayDistance =
          getDistance(userLocation, activity.coords) <= maxDistance;
      }

      const passesFilters =
        matchesLooking &&
        matchesCategories &&
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

  const sortFunction = (a, b) => {
    if (sortBy === "Start Time") {
      return new Date(a.eventStartTimestamp) - new Date(b.eventStartTimestamp);
    } else if (sortBy === "Popularity") {
      const aCount = a.interested ? a.interested.length : 0;
      const bCount = b.interested ? b.interested.length : 0;
      return aCount - bCount;
    } else if (sortBy === "Distance") {
      if (!userLocation) {
        return (
          new Date(a.eventStartTimestamp) - new Date(b.eventStartTimestamp)
        );
      }

      const aHasCoords = a.coords && a.coords.latitude && a.coords.longitude;
      const bHasCoords = b.coords && b.coords.latitude && b.coords.longitude;

      if (aHasCoords && bHasCoords) {
        return (
          getDistance(userLocation, a.coords) -
          getDistance(userLocation, b.coords)
        );
      } else if (aHasCoords) {
        return -1;
      } else if (bHasCoords) {
        return 1;
      }

      return 0;
    }

    return new Date(a.eventStartTimestamp) - new Date(b.eventStartTimestamp);
  };

  const sortedAccepted = [...accepted].sort(sortFunction);
  const sortedRejected = [...rejected].sort(sortFunction);

  return (
    <section>
      <div className="text-left my-5">
        <strong>Filtered Results</strong>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
        {sortedAccepted.map((activity, idx) => (
          <Activity key={`accepted-${idx}`} activity={activity} />
        ))}
      </div>
      <div className="text-left my-5">
        <strong>More results</strong>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
        {sortedRejected.map((activity, idx) => (
          <Activity key={`rejected-${idx}`} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesFeed;
