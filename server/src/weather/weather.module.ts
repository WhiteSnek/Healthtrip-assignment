import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule

@Module({
  imports: [HttpModule], // Add HttpModule to imports
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
