import { useState } from 'react'
import Navbar from '../components/navbar'
import ThemeProvider from '../context/ThemeProvider'
import WeatherDisplay from '../components/weather'
import AdminDashboard from '../components/admin'
import axios from 'axios'

export interface User {
  id: string;
  fullname: string;
  email: string;
  status: string;
  avatar: string;
  role: string;
}


function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <Navbar setUser={setUser} user={user} setError={setError} />
      {error ? (
        <div className="fixed top-40 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center font-semibold">
          {error}
        </div>
      ) : (
        user ? (
          user.role.toLowerCase() === 'admin' ? <AdminDashboard /> : <WeatherDisplay />
        ) : (
          <div className="text-center text-lg text-gray-700 dark:text-gray-300 mt-6">Login to view weather...</div>
        )
      )}
    </ThemeProvider>
  );
}

export default App;
