import Dispatcher from "./components/Dispatcher";
import LocationProvider from "@components/LocationContext";

function App() {
  return (
    <LocationProvider>
      <div>
        <Dispatcher />
      </div>
    </LocationProvider>
  );
}

export default App;
