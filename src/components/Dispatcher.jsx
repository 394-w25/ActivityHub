import { Routes, Route, BrowserRouter } from "react-router-dom";
import OnboardingFlow from "../pages/OnboardingFlow";
import HomePage from "@/pages/HomePage.jsx";
import CreateActivityPage from "@/pages/CreateActivityPage";
import UserProfile from "../pages/UserProfile";
import NotificationPage from "../pages/NotificationPage";
import ChatPage from "@/pages/ChatPage";
import ChatsListPage from "@/pages/ChatsListPage";

const Dispatcher = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create_activity" element={<CreateActivityPage />} />
        <Route path="/" element={<OnboardingFlow />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user_profile/:id" element={<UserProfile />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chats" element={<ChatsListPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Dispatcher;
