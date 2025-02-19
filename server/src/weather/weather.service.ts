import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly weatherApiKey: string;
  private readonly weatherBaseUrl =
    this.configService.get<string>('WEATHER_BASE_URL');
  private readonly aqiToken: string;
  private readonly aqiBaseUrl = this.configService.get<string>('AQI_BASE_URL');
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.weatherApiKey = this.configService.get<string>('WEATHER_API_KEY');
    this.aqiToken = this.configService.get<string>('AQI_TOKEN');
  }

  async getWeather(city: string) {
    try {
      const weatherUrl = `${this.weatherBaseUrl}/forecast.json?q=${city}&days=7&key=${this.weatherApiKey}`;
      const response = await firstValueFrom(this.httpService.get(weatherUrl));
      const { location, forecast } = response.data; 

      return {
        city: location.name,
        country: location.country,
        forecast: forecast.forecastday.map((day) => ({
          date: day.date,
          avgTemp: day.day.avgtemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          humidity: day.day.avghumidity,
          windSpeed: day.day.maxwind_kph,
        })),
      };
    } catch (error) {
      console.error('Error fetching weather:', error.response?.data);
      throw new HttpException(
        error.response?.data?.error?.message || 'Failed to fetch weather data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAqi(city: string) {
    try {
      const aqiUrl = `${this.aqiBaseUrl}/${city}/?token=${this.aqiToken}`;
      const response = await firstValueFrom(this.httpService.get(aqiUrl));
      const data = response.data;

      if (data.status !== 'ok') {
        throw new Error(data.data);
      }

      return {
        city: data.data.city.name,
        aqi: data.data.aqi,
        time: data.data.time.s,
        dominantPollutant: data.data.dominentpol,
        pollutants: data.data.iaqi,
      };
    } catch (error) {
      console.error('Error fetching aqi:', error.response?.data);
      throw new HttpException(
        error.response?.data?.error?.message || 'Failed to fetch aqi data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
