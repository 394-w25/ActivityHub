import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPhone,
  confirmPhoneCode,
  setupRecaptcha,
  resetRecaptcha,
} from "@/hooks/firebase";

const PhoneSignUpPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    try {
      resetRecaptcha();
      await signInWithPhone(phoneNumber);
      setCodeSent(true);
    } catch (err) {
      console.error("Error during phone sign-up:", err);
      setError(err.message);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await confirmPhoneCode(smsCode);
      navigate("/onboarding");
    } catch (err) {
      console.error("Error confirming SMS code:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/splash.png"
            alt="Meet Quest Logo"
            className="w-60 h-60 object-contain mb-2"
          />
          <h2 className="text-xl font-semibold">Sign up with Phone</h2>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Phone Sign-Up Form */}
        {!codeSent ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Send SMS Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmCode} className="space-y-4">
            <div>
              <label className="block mb-1">SMS Code</label>
              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Enter the code"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Confirm Code
            </button>
          </form>
        )}

        {/* Switch Back to Email Sign-Up */}
        <div className="text-center mt-4">
          <span className="text-sm">
            Prefer to use Email or Google?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-orange-500 hover:underline"
            >
              Sign up with Email or Google
            </button>
          </span>
        </div>
      </div>

      {/* reCAPTCHA container must be present */}
      <div
        id="recaptcha-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default PhoneSignUpPage;
