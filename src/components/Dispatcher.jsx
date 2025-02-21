import { Routes, Route, BrowserRouter } from "react-router-dom";
import OnboardingFlow from "./OnboardingFlow";
import HomePage from "@/pages/HomePage.jsx";

const Dispatcher = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/create_activity" element={<CreateActivityPage />} /> */}
        <Route path="/" element={<OnboardingFlow />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Dispatcher;
