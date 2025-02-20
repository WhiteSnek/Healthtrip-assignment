import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";

interface LoginPopupProps {
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose}) => {
  const handleLogin = async(role: 'USER'|'ADMIN') => {
    console.log(role)
    localStorage.setItem('role', role)
    setTimeout(()=>{
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    }, 1000)
   
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-lg">
      <div className="relative bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl shadow-2xl w-96 text-center transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-300"
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Sign in to Continue
        </h2>

        {/* Login Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('USER')}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-lg shadow-md text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
          >
            <FcGoogle className="text-2xl" /> <span>Login as User</span>
          </button>

          <button
            onClick={() => handleLogin('ADMIN')}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-lg shadow-md text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
          >
            <FcGoogle className="text-2xl" /> <span>Login as Admin</span>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="mt-5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
