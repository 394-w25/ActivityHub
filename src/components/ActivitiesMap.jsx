import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ActivitiesMap = () => {
  const [userCoords, setUserCoords] = useState([41.908, -87.649]);
  navigator.geolocation.getCurrentPosition((position) => {
    setUserCoords([position.coords.longitude, position.coords.latitude]);
  });
  return (
    <div>
      <MapContainer center={userCoords} zoom={16} className="h-128">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userCoords}>
          <Popup>Bouldering 3-5pm at Movement Lincoln Park!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ActivitiesMap;
