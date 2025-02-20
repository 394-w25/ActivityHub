import { Routes, Route } from "react-router-dom";
import OnboardingFlow from "./OnboardingFlow";

const Dispatcher = () => {
  return (
    <Routes>
      {/* <Route path="/create_activity" element={<CreateActivityPage />} /> */}
      <Route path="/" element={<OnboardingFlow />} />
    </Routes>
  );
};

export default Dispatcher;
