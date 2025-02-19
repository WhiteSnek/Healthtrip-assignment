import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('weather')
export class WeatherController {
    
}
