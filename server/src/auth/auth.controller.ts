import { Controller, UseGuards, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GoogleAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const { access_token, refresh_token } =
      await this.authService.generateAccessAndRefreshToken(user.id, user.email);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    // if (!user.dob || !user.monthlyIncome || !user.creditDate || !user.gender) {
    //   return res.redirect('http://localhost:5173/complete-profile');
    // }

    // return res.redirect('http://localhost:5173/dashboard');
    return user
  }
}
