import { Routes, Route, BrowserRouter } from "react-router-dom";
import OnboardingFlow from "./OnboardingFlow";

const Dispatcher = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/create_activity" element={<CreateActivityPage />} /> */}
        <Route path="/" element={<OnboardingFlow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Dispatcher;
