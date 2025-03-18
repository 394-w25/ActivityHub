import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import googleIcon from "@assets/google.png";
import { signInWithEmail, signInWithGoogle } from "@/hooks/firebase";

const SignInPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    const isEmail = identifier.includes("@");

    if (isEmail) {
      try {
        await signInWithEmail(identifier, password);
        navigate("/onboarding");
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Phone+Password is not supported by Firebase.");
    }
  };

  const handleGoogleSignIn = async () => {
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
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/splash.png"
            alt="Meet Quest Logo"
            className="w-60 h-60 object-contain mb-2"
          />

          <h2 className="text-xl text-left self-start">Sign in</h2>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email or phone */}
          <div className="relative">
            <label className="block mb-1"></label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border border-gray-300 px-10 py-2 rounded-lg"
              placeholder="abc@email.com"
              required
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              📧
            </span>
          </div>

          <div className="relative">
            <label className="block mb-1"></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-10 py-2 rounded-lg"
              placeholder="Your password"
              required
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔒
            </span>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              className="text-orange-500 hover:underline"
              onClick={() => setError("Forgot password flow not implemented.")}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-400 text-white rounded hover:bg-orange-500 rounded-lg"
          >
            Sign in
          </button>
        </form>

        {/* OR - Google Login */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="h-px w-16 bg-gray-300"></div>
          <span className="text-gray-500">OR</span>
          <div className="h-px w-16 bg-gray-300"></div>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 border border-gray-300 flex items-center justify-center space-x-2 rounded-lg"
        >
          <img src={googleIcon} alt="Google icon" className="w-5 h-5 mr-2" />

          <span>Login with Google</span>
        </button>

        {/* Phone Sign-Up Button */}
        <button
          onClick={() => navigate("/phone-signup")}
          className="w-full py-3 border border-gray-300 flex items-center justify-center space-x-2 rounded-lg mt-2"
        >
          <span>Login with Phone</span>
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
