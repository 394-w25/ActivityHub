import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "./LocationPicker";

const LocationModal = ({ currentLocation, onLocationChange, onClose }) => {
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        onClick={handleContentClick}
        className="bg-white p-4 rounded-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Your Location</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            Close
          </button>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <MapContainer
            center={currentLocation || [41.8781, -87.6298]} // Chicago as fallback
            zoom={13}
            className="h-96 w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationPicker
              defaultLocation={currentLocation}
              onLocationChange={onLocationChange}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
