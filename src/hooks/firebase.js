import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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
  databaseURL: "https://activityhubapp-default-rtdb.firebaseio.com",
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

// ------------------------- Google Sign In -------------------------
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
        name: existingData?.displayName || user.displayName,
        email: existingData?.email || user.email,
        photoURL: existingData?.photoURL || user.photoURL,
        bio: existingData?.bio || "",
        hosted_activities: existingData?.hosted_activities || {},
      });
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// ------------------------- Email Authentication -------------------------

// Sign Up with Email
export const signUpWithEmail = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          unsubscribe();
          resolve();
        }
      });
    });

    // Send verification email
    await sendEmailVerification(user);
    // Optionally, create or update the user in your database
    const userRef = ref(database, `users/${user.uid}`);
    update(userRef, {
      email: user.email,
      name: user.displayName || "",
      bio: "",
      hosted_activities: {},
    });
    return user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

// Sign In with Email
export const signInWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

// ------------------------- Phone Authentication -------------------------

// Initialize reCAPTCHA verifier (make sure a div with id "recaptcha-container" exists in your UI)
export const setupRecaptcha = () => {
  // If a verifier already exists, clear it first
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = null;
  }
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA verified", response);
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired, reset required.");
      },
    },
  );
};

// Start phone sign in process (sends SMS code)
export const signInWithPhone = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier,
    );
    window.confirmationResult = confirmationResult;
    console.log("SMS code sent.");
  } catch (error) {
    console.error("Error during phone sign-in:", error);
    throw error;
  }
};

// Confirm the SMS verification code
export const confirmPhoneCode = async (code) => {
  try {
    const result = await window.confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    console.error("Error confirming SMS code:", error);
    throw error;
  }
};

// ------------------------- Sign Out -------------------------
export const firebaseSignOut = () => {
  signOut(auth).catch((error) => console.error("Error signing out:", error));
};

// ------------------------- Custom Hooks -------------------------

// Track authentication state
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  return [user, loading];
};

// Read data from the database
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
    return unsubscribe;
  }, [path]);
  return [data, error];
};

// Update data in the database
export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback(
    async (value) => {
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

// Remove data from the database
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
  const existingData = snapshot.val();
  await update(chatRef, {
    users: { [user1Id]: true, [user2Id]: true },
    createdAt: existingData?.createdAt || Date.now(),
  });
  return chatKey;
};

export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  await push(messagesRef, {
    sender: senderId,
    text,
    timestamp: Date.now(),
    read: false,
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
