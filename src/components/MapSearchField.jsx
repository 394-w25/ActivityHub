import { useEffect } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";

const MapSearchField = ({ setActivityLocation }) => {
  const provider = new OpenStreetMapProvider();
  const searchControl = new GeoSearchControl({
    provider: provider,
    style: "bar",
  });
  const map = useMap();
  map.on("geosearch/showlocation", (e) => {
    setActivityLocation({
      label: e.location.label,
      coords: {
        latitude: e.location.y,
        longitude: e.location.x,
      },
    });
  });
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);
  return null;
};

export default MapSearchField;
