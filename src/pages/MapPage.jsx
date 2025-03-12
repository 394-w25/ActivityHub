// MapPage.jsx
import React from "react";
import ActivitiesMap from "@components/ActivitiesMap.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MapPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="fixed z-2 top-24 left-4 w-6 h-6"
      />
      <ActivitiesMap heightClass="h-screen" />
    </div>
  );
};

export default MapPage;
