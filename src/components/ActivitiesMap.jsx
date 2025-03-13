import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Activity from "@components/Activity";
import { useDbData } from "@hooks/firebase";
import { getHostedActivities } from "@/utils/activity";
import { Handshake, Heart, Star } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import ActivityDetails from "./ActivityDetails";

const ActivitiesMap = ({ center, heightClass = "h-screen" }) => {
  const mapCenter = center || [41.8781, -87.6298];
  const [data, error] = useDbData("/users");
  const [selectedActivity, setSelectedActivity] = useState(null);

  if (error) return <h1>Error loading data: {error.toString()}</h1>;
  if (data === undefined) return <h1>Loading data...</h1>;
  if (!data) return <h1>No data found</h1>;

  const allActivities = getHostedActivities(data, {}) || [];

  // randomize icon for markers
  const getRandomIcon = () => {
    const icons = [Handshake, Heart, Star];
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  // randomize color for markers
  const getRandomColorClass = () => {
    const colors = [
      "bg-green-600",
      "bg-blue-600",
      "bg-red-600",
      "bg-purple-600",
      "bg-pink-600",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <>
      <div className={heightClass}>
        <MapContainer
          center={mapCenter}
          zoom={14}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
            url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png"
          />
          <Marker position={mapCenter}>
            <Popup>Your location</Popup>
          </Marker>
          {Array.isArray(allActivities) &&
            allActivities.map((activity, idx) => {
              if (!activity || !activity.coords) return null;

              // random icon and color for each marker
              const randomIconComponent = getRandomIcon();
              const randomColor = getRandomColorClass();

              const randomIconMarkup = renderToStaticMarkup(
                <div className="flex flex-col">
                  <div className="w-16 h-16 p-2 rounded-[5px] bg-white">
                    <div
                      className={`w-12 h-12 p-1 rounded-[5px] ${randomColor}`}
                    >
                      {React.createElement(randomIconComponent, {
                        className: "w-10 h-10 text-white",
                      })}
                    </div>
                  </div>
                  <div className="w-0 h-0 ml-[2px] mt-[-2px] border-l-[30px] border-l-transparent border-t-[25px] border-t-white border-r-[30px] border-r-transparent"></div>
                </div>,
              );

              const customIcon = L.divIcon({
                html: randomIconMarkup,
                iconAnchor: [30, 85],
              });

              return (
                <Marker
                  icon={customIcon}
                  position={Object.values(activity.coords)}
                  key={idx}
                  eventHandlers={{
                    click: () => {
                      setSelectedActivity(activity);
                    },
                  }}
                />
              );
            })}
        </MapContainer>
      </div>

      {selectedActivity && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <ActivityDetails
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        </div>
      )}
    </>
  );
};

export default ActivitiesMap;
