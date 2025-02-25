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

export const getActivities = (
  allData,
  { userFilter = (user) => true, activityFilter = (activity) => true },
) => {
  const result = Object.entries(allData.users)
    .filter(([userID]) => userFilter(userID))
    .flatMap(([userID, userData]) =>
      Object.entries(userData.activities || {}).filter(
        ([activityID, activityData]) => activityFilter(activityData),
      ),
    );
  return result;
};

export const removeActivity = (userID, activityID) =>
  useDbRemove(`users/${userID}/activities/${activiyID}`);

export const updateActivity = (userID, activityData) => {
  const [updateActivity] = useDbUpdate(`users/${userID}/activities`);
  updateActivity(activityData);
};
