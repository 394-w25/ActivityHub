/*
 * Activity
 * - UUID: String
 * - Creation Timestamp: String
 * - Edited Timestamp: String
 * - Event Timestamp: String
 * - Location: String
 * - Coords: Object
 *   - x: Number
 *   - y: Number
 * - Description: String
 * - Group Size: Number
 * - Poster UID: String
 * - Interested UIDs: String[]
 */

import { useDbData, useDbUpdate, useDbRemove } from "@hooks/firebase";

export const getHostedActivities = (
  allData,
  { userFilter = (user) => true, activityFilter = (activity) => true },
) => {
  const result = Object.entries(allData.users)
    .filter(([userID]) => userFilter(userID))
    .flatMap(([userID, userData]) =>
      Object.values(userData.hosted_activities || {}).filter((activityData) =>
        activityFilter(activityData),
      ),
    );
  return result;
};

export const removeHostedActivity = (userID, activityID) =>
  useDbRemove(`users/${userID}/hosted_activities/${activityID}`);

export const updateHostedActivity = (userID, activityData) => {
  const [updateHostedActivity] = useDbUpdate(
    `users/${userID}/hosted_activities`,
  );
  updateHostedActivity(activityData);
};
