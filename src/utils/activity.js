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

import { useDbUpdate, useDbRemove } from "@hooks/firebase";

export const getHostedActivities = (
  userData,
  { userFilter = (user) => true, activityFilter = (activity) => true },
) => {
  return Object.entries(userData)
    .filter(([userID]) => userFilter(userID))
    .flatMap(([userID, userData]) =>
      Object.entries(userData.hosted_activities || {}).map(
        ([activityID, activityData]) => ({
          ...activityData,
          id: activityID, // Attach the activity ID
          posterUid: userID, // and the user who created the activity
        }),
      ),
    )
    .filter(activityFilter);
};

export const removeHostedActivity = (userID, activityID) =>
  useDbRemove(`users/${userID}/hosted_activities/${activityID}`);

export const updateHostedActivity = (userID, activityData) => {
  const [updateHostedActivity] = useDbUpdate(
    `users/${userID}/hosted_activities`,
  );
  updateHostedActivity(activityData);
};
