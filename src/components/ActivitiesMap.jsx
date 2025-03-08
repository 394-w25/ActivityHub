import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Activity from "@components/Activity";
import { useDbData } from "@hooks/firebase";
import { getHostedActivities } from "@/utils/activity";

const ActivitiesMap = () => {
  const [userCoords, setUserCoords] = useState([42.056, -87.6755]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserCoords([position.coords.longitude, position.coords.latitude]);
    });
  });

  const [data, error] = useDbData("/users");

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  const allActivities = getHostedActivities(data, {}) || [];
  return (
    <div>
      <MapContainer center={userCoords} zoom={17} className="h-128 z-0">
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png"
        />
        {Array.isArray(allActivities) &&
          allActivities.map((activity, idx) => {
            if (!activity || !activity.coords) return null;
            return (
              <Marker position={Object.values(activity?.coords)} key={idx}>
                <Popup minWidth="500">
                  <Activity activity={activity} />
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default ActivitiesMap;
