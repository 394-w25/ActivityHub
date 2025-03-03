import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("ABOUT");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          console.error("User profile not found.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <h1>Loading profile...</h1>;
  if (!user) return <h1>User not found</h1>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-black text-xl">
          ←
        </button>
        <span className="text-gray-600 font-medium">Profile</span>
        <div className="w-6"></div>
      </div>

      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={user.photoURL || "../../assets/default-profile.png"}
            alt={`${user.firstName || "User"}'s profile`}
          />
          <AvatarFallback>{user.firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <h1 className="mt-2 text-2xl font-bold">{user.firstName || "User"}</h1>
      </div>

      <div className="mt-4 flex space-x-6 border-b-2 w-full max-w-md text-center">
        {["ABOUT", "EVENT", "TRUST BADGE"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 w-full font-semibold ${selectedTab === tab ? "text-orange-500 border-orange-500 border-b-2" : "text-gray-500"}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md mt-4">
        {selectedTab === "ABOUT" && (
          <>
            <p className="text-sm text-gray-700 text-center px-4">
              {user.bio || "No bio available."}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {user.interests ? (
                user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full text-white"
                    style={{ backgroundColor: getTagColor(interest) }}
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No interests listed</p>
              )}
            </div>
          </>
        )}
        {selectedTab === "EVENT" && (
          <p className="text-gray-500 text-center">
            User’s upcoming events will appear here.
          </p>
        )}
        {selectedTab === "TRUST BADGE" && (
          <p className="text-gray-500 text-center">
            User’s trust and verification info will appear here.
          </p>
        )}
      </div>
    </div>
  );
};

const getTagColor = (interest) => {
  const colors = {
    Hike: "#4CAF50",
    Food: "#3F51B5",
    Concert: "#E53935",
    Music: "#FB8C00",
    Art: "#673AB7",
    Movie: "#26A69A",
    Others: "#29B6F6",
  };
  return colors[interest] || "#9E9E9E";
};

export default ProfilePage;
