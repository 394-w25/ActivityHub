import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  signInWithGoogle,
  signInWithEmail,
  setupRecaptcha,
  signInWithPhone,
  confirmPhoneCode,
} from "../hooks/firebase";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [method, setMethod] = useState("google"); // Options: "google", "email", "phone"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (method === "phone") {
      setupRecaptcha();
    }
  }, [method]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/"); // Adjust navigation as needed
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePhoneSendCode = async (e) => {
    e.preventDefault();
    try {
      await signInWithPhone(phoneNumber);
      // Code sent—now prompt user to enter the SMS code below
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePhoneConfirmCode = async (e) => {
    e.preventDefault();
    try {
      await confirmPhoneCode(smsCode);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <button
          onClick={() => setMethod("google")}
          className="mr-2 px-4 py-2 border rounded"
        >
          Google
        </button>
        <button
          onClick={() => setMethod("email")}
          className="mr-2 px-4 py-2 border rounded"
        >
          Email
        </button>
        <button
          onClick={() => setMethod("phone")}
          className="px-4 py-2 border rounded"
        >
          Phone
        </button>
      </div>

      {method === "google" && (
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg shadow-md transition hover:bg-orange-600"
          >
            Continue with Google
          </button>
        </div>
      )}

      {method === "email" && (
        <form onSubmit={handleEmailSignIn} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Sign In with Email
          </button>
        </form>
      )}

      {method === "phone" && (
        <div className="w-full max-w-md">
          <form onSubmit={handlePhoneSendCode} className="mb-4">
            <div className="mb-4">
              <label className="block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="+1234567890"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Send SMS Code
            </button>
          </form>
          <form onSubmit={handlePhoneConfirmCode}>
            <div className="mb-4">
              <label className="block mb-1">SMS Code</label>
              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter the code"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Confirm Code
            </button>
          </form>
          <div id="recaptcha-container"></div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
