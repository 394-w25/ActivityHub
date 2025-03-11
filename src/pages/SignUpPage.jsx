import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import googleIcon from "@assets/google.png";
import { signUpWithEmail, signInWithGoogle, auth } from "@/hooks/firebase";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!identifier.includes("@")) {
      setError("Please enter a valid email address for email sign-up.");
      return;
    }
    try {
      await signUpWithEmail(identifier, password);
      console.log("Current Auth User:", auth.currentUser);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/onboarding");
    } catch (err) {
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
          <h2 className="text-xl self-start text-left ">Sign up</h2>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Email Sign-Up Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="relative">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border border-gray-300 px-10 py-3 rounded-lg"
              placeholder="e.g., abc@email.com"
              required
            />
            <span className="absolute left-3 top-[65%] transform -translate-y-1/2 text-gray-400">
              📧
            </span>
          </div>

          <div className="relative">
            <label className="block mb-1">Your password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-10 py-3 rounded-lg"
              placeholder="Your password"
              required
            />
            <span className="absolute left-3 top-[65%] transform -translate-y-1/2 text-gray-400">
              🔒
            </span>
          </div>

          <div className="relative">
            <label className="block mb-1">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 px-10 py-3 rounded-lg"
              placeholder="Confirm password"
              required
            />
            <span className="absolute left-3 top-[65%] transform -translate-y-1/2 text-gray-400">
              🔒
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-400 text-white rounded hover:bg-orange-500 rounded-lg"
          >
            Sign up with Email
          </button>
        </form>

        {/* OR Separator */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="h-px w-16 bg-gray-300"></div>
          <span className="text-gray-500">OR</span>
          <div className="h-px w-16 bg-gray-300"></div>
        </div>

        {/* Google Sign-Up Button */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full py-3 border border-gray-300 flex items-center justify-center space-x-2 rounded-lg"
        >
          <img src={googleIcon} alt="Google icon" className="w-5 h-5" />
          <span>Sign Up with Google</span>
        </button>

        {/* Phone Sign-Up Button */}
        <button
          onClick={() => navigate("/phone-signup")}
          className="w-full py-3 border border-gray-300 flex items-center justify-center space-x-2 rounded-lg mt-2"
        >
          <span>Login with Phone</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-orange-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
