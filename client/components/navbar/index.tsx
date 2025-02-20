import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import axios from "axios";
import LoginPopup from "./popup";
import { User } from "../../src/App";

interface NavbarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const Navbar: React.FC<NavbarProps> = ({ user, setUser, setError }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout",{}, {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Error logging out");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const role = localStorage.getItem('role')
        await axios.patch(`/auth/${role}`, {}, {withCredentials: true})
        const response = await axios.get("/auth/user", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error: any) {
        setError(error.response.data.message);
      }
    };
    fetchUser();
  }, [setUser, setError]);
  
  return (
    <nav className="flex fixed w-screen justify-between items-center p-4 shadow-md bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-200 transition-all duration-300">
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-300 tracking-wide">
        WeatherApp
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          <MdDarkMode className="text-xl hidden dark:block" />
          <MdLightMode className="text-xl dark:hidden" />
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-900 dark:text-gray-200 font-medium">
              {user.fullname}
            </span>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg shadow-md text-gray-900 dark:bg-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg shadow-md text-gray-900 dark:bg-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
            onClick={() => setIsPopupOpen(true)}
          >
            <FcGoogle className="text-xl rounded-full p-1" /> Login
          </button>
        )}
      </div>

      {isPopupOpen && <LoginPopup onClose={() => setIsPopupOpen(false)}/>} 
    </nav>
  );
};

export default Navbar;
