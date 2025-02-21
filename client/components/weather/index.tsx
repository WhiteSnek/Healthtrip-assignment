import React, { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  city: string;
  country: string;
  forecast: {
    date: string;
    avgTemp: number;
    condition: string;
    icon: string;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    windSpeed: number;
  }[];
}

interface AQIData {
  city: string;
  aqi: number;
  time: string;
  dominantPollutant: string;
}

const WeatherDisplay: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>("Delhi");
  const [edit, setEdit] = useState<boolean>(false);
  const [tempCity, setTempCity] = useState<string>(city);

  useEffect(() => {
    const fetchWeatherAndAQI = async () => {
      setLoading(true);
      try {
        const weatherResponse = await axios.get(`/weather/weather/${city}`, {
          withCredentials: true,
        });
        const aqiResponse = await axios.get(`/weather/aqi/${city}`, {
          withCredentials: true,
        });

        setWeather(weatherResponse.data);
        setAqi(aqiResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndAQI();
  }, [city]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-300 dark:bg-gray-800 text-white">
        <div className="text-center text-lg">Loading...</div>
      </div>
    );
  }

  if (!weather || !aqi) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-300 dark:bg-gray-800 text-red-200">
        <div className="text-center text-lg">Failed to load weather data</div>
      </div>
    );
  }

  const today = weather.forecast[0];

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempCity(e.target.value);
  };

  const handleCityUpdate = () => {
    if (tempCity.trim() !== "") {
      setCity(tempCity);
      setEdit(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCityUpdate();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-800 p-4 md:p-6">
      <div className="w-full max-w-4xl p-6 md:p-8 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            {edit ? (
              <input
                type="text"
                value={tempCity}
                onChange={handleCityChange}
                onKeyPress={handleKeyPress}
                className="border border-gray-400 dark:border-gray-600 p-2 rounded-lg text-gray-900 dark:text-gray-200 w-32 sm:w-auto"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {weather.city}, {weather.country}
              </h2>
            )}
            {edit ? (
              <button
                onClick={handleCityUpdate}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Update
              </button>
            ) : (
              <button
                onClick={() => setEdit(true)}
                className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Change
              </button>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
            {new Date(today.date).toDateString()}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center">
            <img src={today.icon} alt={today.condition} className="w-16 h-16 md:w-24 md:h-24" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100">
              {Math.round(today.avgTemp)}°
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {today.condition}
            </p>
          </div>

          <div className="text-gray-700 dark:text-gray-300 text-sm space-y-2 md:space-y-3">
            <p className="text-lg font-semibold">
              Max: {today.maxTemp}° / Min: {today.minTemp}°
            </p>
            <p>Humidity: {today.humidity}%</p>
            <p>Wind Speed: {today.windSpeed} km/h</p>
            <p className="font-semibold text-lg">
              AQI: {aqi.aqi} ({aqi.dominantPollutant})
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          <h3 className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">
            7-Day Forecast
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
            {weather.forecast.map((day, index) => (
              <div key={index} className="p-3 md:p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center shadow-md">
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <img src={day.icon} alt={day.condition} className="mx-auto w-10 h-10 md:w-12 md:h-12" />
                <p className="text-base md:text-lg text-gray-900 dark:text-gray-100 font-medium">
                  {Math.round(day.avgTemp)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
