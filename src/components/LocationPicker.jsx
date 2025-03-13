import React, { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ defaultLocation, onLocationChange }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (!selectedLocation && defaultLocation) {
      setSelectedLocation(defaultLocation);
    }
  }, [defaultLocation, selectedLocation]);

  useMapEvents({
    click: (e) => {
      if (e.originalEvent) e.originalEvent.stopPropagation();
      const newLocation = [e.latlng.lat, e.latlng.lng];
      setSelectedLocation(newLocation);
      if (onLocationChange) {
        onLocationChange(newLocation);
      }
    },
  });

  return (
    <>
      {selectedLocation && (
        <Marker
          position={selectedLocation}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              if (e.originalEvent) e.originalEvent.stopPropagation();
              const marker = e.target;
              const newPos = marker.getLatLng();
              const updatedLocation = [newPos.lat, newPos.lng];
              setSelectedLocation(updatedLocation);
              if (onLocationChange) {
                onLocationChange(updatedLocation);
              }
            },
          }}
        >
          <Popup>
            {`Lat: ${selectedLocation[0].toFixed(4)}, Lng: ${selectedLocation[1].toFixed(4)}`}
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default LocationPicker;
