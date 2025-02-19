import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guard';
import { RequestWithUser } from './types/request_with_user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: RequestWithUser) {
    console.log('User from Google:', req.user); 

    if (!req.user) {
      return { message: 'Authentication failed' };
    }

    const { access_token, refresh_token } =
      await this.authService.generateAccessAndRefreshToken(req.user.id, req.user.email);

    return {
      user: req.user,
      access_token,
      refresh_token,
    };
  }
}
