import { Routes, Route, BrowserRouter } from "react-router-dom";
import OnboardingFlow from "./OnboardingFlow";
import HomePage from "@/pages/HomePage.jsx";
import CreateActivityPage from "@/pages/CreateActivityPage";
import UserProfile from "./UserProfile";

const Dispatcher = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create_activity" element={<CreateActivityPage />} />
        <Route path="/" element={<OnboardingFlow />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user_profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Dispatcher;
