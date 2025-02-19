import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { WeatherService } from './weather.service'; // Assuming you have a service to handle weather logic

@UseGuards(JwtGuard)
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('weather/:city')
  async getCityWeather(@Param('city') city: string) {
    const weatherData = await this.weatherService.getWeather(city);
    return weatherData;
  }

  @Get('aqi/:city')
  async getCityAqi(@Param('city') city: string) {
    const weatherData = await this.weatherService.getAqi(city);
    return weatherData;
  }
}
