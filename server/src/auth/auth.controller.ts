import { Controller, UseGuards, Get, Req, Res, Post, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard, JwtGuard } from './guard';
import { RequestWithUser } from './types/request_with_user';
import { Response } from 'express';
import { GetUser } from './decorator';
import { ROLE, User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {

    if (!req.user) {
      return { message: 'Authentication failed' };
    }

    const { access_token, refresh_token } =
      await this.authService.generateAccessAndRefreshToken(
        req.user.id,
        req.user.email,
      );

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
    return res.redirect('http://localhost:5173');
  }
  @UseGuards(JwtGuard)
  @Get('user')
  async getUser(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(200).json({message: 'Logout successfull'})
  }

  @UseGuards(JwtGuard)
  @Patch(':role')
  async assignRoles(@Param('role') role: ROLE, @GetUser('id') userId: string){
    console.log(role)
    return this.authService.assignRoles(role, userId)
  }
}
