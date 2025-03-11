import React, { useState } from "react";
import { signInWithPhone, confirmPhoneCode } from "@/hooks/firebase";
import { useNavigate } from "react-router-dom";

const PhoneSignUpForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    try {
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
    <div className="w-full max-w-md space-y-4 mt-4">
      {error && <p className="text-red-500">{error}</p>}
      {!codeSent ? (
        <form onSubmit={handleSendCode}>
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
            className="w-full py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Send SMS Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmCode}>
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
            className="w-full py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Confirm Code
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneSignUpForm;
