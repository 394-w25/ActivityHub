import { Routes, Route, BrowserRouter } from "react-router-dom";
// import OnboardingFlow from "./OnboardingFlow";
import HomePage from "@/pages/HomePage.jsx";
import CreateActivityPage from "@/pages/CreateActivityPage";
import UserProfile from "./UserProfile";
import NotificationPage from "./NotificationPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import PhoneSignUpPage from "@/pages/PhoneSignUpPage";
import OnboardingPage from "@/pages/OnboardingPage";
import LandingPage from "@/pages/LandingPage";

const Dispatcher = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create_activity" element={<CreateActivityPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/phone-signup" element={<PhoneSignUpPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/user_profile/:id" element={<UserProfile />} />
        <Route path="/notification" element={<NotificationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Dispatcher;
