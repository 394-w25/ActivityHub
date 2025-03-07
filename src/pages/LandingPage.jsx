import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="relative mb-8 flex flex-col items-center">
        <img
          src="/splash.png"
          alt="Meet Quest Logo"
          className="w-80 h-80 object-contain mb-4"
        />
        <h2 className="text-2xl ">Let’s Connect Together</h2>
      </div>

      <div className="w-full max-w-xs flex flex-col space-y-4">
        <button
          onClick={() => navigate("/signin")}
          className="w-full py-3 border-2 border-gray-400 text-black rounded-full"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-full py-3 bg-orange-400 text-white rounded-full"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
