import { initializeApp } from "firebase/app";
// Note: add SDKs for Firebase products that you want to use
// See: https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue,
  remove,
} from "firebase/database";
import { useState, useEffect, useCallback } from "react";

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5F93mf9yEHv1hVZqSn4qFyXlPYMf6hGI",
  authDomain: "activityhubapp.firebaseapp.com",
  projectId: "activityhubapp",
  storageBucket: "activityhubapp.firebasestorage.app",
  messagingSenderId: "622399618264",
  appId: "1:622399618264:web:de0f9378588991c1b96bad",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const database = getDatabase(firebase);
const db = getFirestore(firebase);
export { firebase, auth, database, db };

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = result.user;

    if (user) {
      // Create or update user in the database
      const userRef = ref(database, `users/${user.uid}`);

      const snapshot = await get(userRef);
      const existingData = snapshot.val();

      update(userRef, {
        displayName: existingData?.displayName || user.displayName,
        email: existingData?.email || user.email,
        photoURL: existingData?.photoURL || user.photoURL,
        bio: existingData?.bio || "",
        hosted_activities: existingData?.hosted_activities || {},
      });
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

// Sign out
export const firebaseSignOut = () => {
  signOut(auth).catch((error) => console.error("Error signing out:", error));
};

// Custom Hook: Track authentication state
export const useAuthState = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  return [user];
};

// Custom Hook: Read data from the database
export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) {
      console.error("Error: Path is null or undefined");
      return;
    }
    const dbRef = ref(database, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        setData(snapshot.val());
      },
      (error) => {
        setError(error);
      },
    );

    return unsubscribe; // Cleanup on unmount
  }, [path]);

  return [data, error];
};

// Custom Hook: Update data in the database
export const useDbUpdate = (path) => {
  const [result, setResult] = useState();

  const updateData = useCallback(
    async (path, value) => {
      if (!path) {
        console.error("Error: Path is null or undefined");
        return;
      }

      if (!value || Object.keys(value).length === 0) {
        console.log(value);
        console.error("Error: Cannot update with an empty or invalid object");
        return;
      }

      try {
        await update(ref(database, path), value);
        setResult({
          timestamp: Date.now(),
          message: "Update successful",
          error: null,
        });
      } catch (error) {
        setResult({ timestamp: Date.now(), message: "Update failed", error });
        console.error("Firebase update error:", error);
      }
    },
    [path],
  );

  return [updateData, result];
};

export const useDbRemove = (path) => {
  const [result, setResult] = useState();
  const removeData = useCallback(() => {
    console.log(path);
    remove(ref(database, path))
      .then(() =>
        setResult({
          timestamp: Date.now(),
          message: "Removal successful",
          error: null,
        }),
      )
      .catch((error) =>
        setResult({
          timestamp: Date.now(),
          message: "Removal failed",
          error,
        }),
      );
  }, [path]);
  return [removeData, result];
};
