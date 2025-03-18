import { Routes, Route, BrowserRouter } from "react-router-dom";
import OnboardingFlow from "../pages/OnboardingFlow";
import HomePage from "@/pages/HomePage.jsx";
import CreateActivityPage from "@/pages/CreateActivityPage";
import UserProfile from "../pages/UserProfile";
import NotificationPage from "../pages/NotificationPage";
import ChatPage from "@/pages/ChatPage";
import ChatsListPage from "@/pages/ChatsListPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import PhoneSignUpPage from "@/pages/PhoneSignUpPage";
import LandingPage from "@/pages/LandingPage";
import MapPage from "@/pages/MapPage";

const Dispatcher = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create_activity" element={<CreateActivityPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/phone-signup" element={<PhoneSignUpPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/user_profile/:id" element={<UserProfile />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chats" element={<ChatsListPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Dispatcher;
