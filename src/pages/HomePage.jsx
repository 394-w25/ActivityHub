import HomeScreen from "@/components/HomeScreen.jsx";
import ActivitiesFeed from "@/components/ActivitiesFeed.jsx";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HomeScreen />
        <div className="mt-8">
          <ActivitiesFeed />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
