import React, { useState } from "react";
import OnboardingFlow from "./components/OnboardingFlow";
import Activity from "@components/Activity";
import HomeScreen from "@components/HomeScreen";
import Dispatcher from "./components/Dispatcher";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Dispatcher />
      </div>
    </BrowserRouter>
  );
};

export default App;
