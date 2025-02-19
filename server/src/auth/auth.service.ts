import {
    Injectable,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService,
      ) {
      }

    async generateAccessAndRefreshToken(
        userId: string,
        email: string,
      ): Promise<{ access_token: string; refresh_token: string }> {
        const payload = {
          sub: userId,
          email,
        };
    
        const access_token = await this.jwt.signAsync(payload, {
          expiresIn: this.config.get('ACCESS_TOKEN_EXPIRY'),
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
        });
    
        const refresh_token = await this.jwt.signAsync(payload, {
          expiresIn: this.config.get('REFRESH_TOKEN_EXPIRY'),
          secret: this.config.get('REFRESH_TOKEN_SECRET'),
        });
    
        return {
          access_token,
          refresh_token,
        };
      }
}
