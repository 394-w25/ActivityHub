import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProfilePage = () => {
  const { userId } = useParams(); // Get userId from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`); // Fetch user data from Firebase
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
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <Card className="w-full max-w-md bg-white shadow-md rounded-md p-4">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user.photoURL || "../../assets/default-profile.png"}
              alt={`${user.firstName || "User"}'s profile`}
            />
            <AvatarFallback>{user.firstName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-2 text-2xl font-bold">
            {user.firstName || "User"}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {user.bio || "No bio available"}
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Interests Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Interests</h2>
            <p className="text-sm text-gray-600">
              {user.interests?.join(", ") || "No interests listed"}
            </p>
          </div>

          {/* Past Activities */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Past Activities</h2>
            {user.activities ? (
              <ul className="text-sm text-gray-600">
                {Object.values(user.activities).map((activity, index) => (
                  <li key={index}>{activity.title || "Activity"}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No past activities</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
