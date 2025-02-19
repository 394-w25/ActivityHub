import React, { useState } from "react";
import OnboardingFlow from "@components/OnboardingFlow";
import HomeScreen from "@components/HomeScreen";

const App = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  return (
    <div className="App">
      {hasCompletedOnboarding ? (
        <HomeScreen />
      ) : (
        <OnboardingFlow onComplete={() => setHasCompletedOnboarding(true)} />
      )}
    </div>
  );
};

export default App;
