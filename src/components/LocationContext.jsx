import React, { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");

  useEffect(() => {
    // Check the current geolocation permission status
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setPermissionStatus(result.state);
    });
  }, []);

  const getUserLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setPermissionStatus("granted");
      },
      (error) => {
        console.error("Error fetching location:", error.message);
        setPermissionStatus("denied");
        alert(
          "Failed to retrieve location. Please enable location permissions.",
        );
      },
    );
  };

  return (
    <LocationContext.Provider
      value={{ location, permissionStatus, getUserLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
