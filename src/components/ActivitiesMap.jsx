import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ActivitiesMap = () => {
  const [userCoords, setUserCoords] = useState([41.908, -87.649]);
  navigator.geolocation.getCurrentPosition((position) => {
    setUserCoords([position.coords.longitude, position.coords.latitude]);
  });
  return (
    <div>
      <MapContainer center={userCoords} zoom={17} className="h-128">
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png"
        />
        <Marker position={userCoords}>
          <Popup>Bouldering 3-5pm at Movement Lincoln Park!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ActivitiesMap;
