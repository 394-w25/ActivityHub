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
  push,
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
        activities: existingData?.activities || {},
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  return [user, loading];
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

// Messaging
export const createOrGetChat = async (user1Id, user2Id) => {
  const chatKey = [user1Id, user2Id].sort().join("_");

  const chatRef = ref(database, `chats/${chatKey}`);
  const snapshot = await get(chatRef);

  if (!snapshot.exists()) {
    await set(chatRef, {
      users: { [user1Id]: true, [user2Id]: true },
      createdAt: Date.now(),
    });
  }

  return chatKey;
};

export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  await push(messagesRef, {
    sender: senderId,
    text,
    timestamp: Date.now(),
  });
};

export const useChatMessages = (chatId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        setMessages(
          Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,
          })),
        );
      } else {
        setMessages([]);
      }
    });

    return unsubscribe;
  }, [chatId]);
  return messages;
};

export const deleteMessage = async (chatId, messageId) => {
  const messageRef = ref(database, `chats/${chatId}/messages/${messageId}`);
  await remove(messageRef);
};

export const useUserChats = (userId) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const chatsRef = ref(database, "chats");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        const userChats = Object.keys(chatData).filter((chatId) =>
          chatId.includes(userId),
        );
        setChats(userChats);
      } else {
        setChats([]);
      }
    });

    return unsubscribe;
  }, [userId]);

  return chats;
};
