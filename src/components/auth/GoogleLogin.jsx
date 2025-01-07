import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config";

const GoogleLogin = ({ setUser }) => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#202123]">
      <div className="p-8 bg-[#2C2C2E] rounded-lg shadow-2xl max-w-md w-full border border-gray-700">
        <h1 className="mb-8 text-4xl font-bold text-center text-[#FF3B30]">
          GymStats
        </h1>
        <p className="mb-8 text-[#F0F0F0] text-center text-lg">
          Registra y controla tus entrenamientos diarios
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-8 py-4 text-[#FFFFFF] bg-[#FF3B30] rounded-lg hover:bg-[#C0392B] transition-colors"
        >
          <svg className="w-7 h-7 mr-3" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
            />
          </svg>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;
