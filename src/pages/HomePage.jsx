import HomeScreen from "@/pages/HomeScreen.jsx";
import ActivitiesFeed from "@/components/ActivitiesFeed.jsx";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <HomeScreen />
      </div>
    </div>
  );
}

export default HomePage;
