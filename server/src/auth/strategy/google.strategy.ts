import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

enum ROLE {
  USER = "USER",
  ADMIN = "ADMIN"
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      passReqToCallback: true, // Allows us to access the request object in validate()
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;
    const avatar = photos[0]?.value || '';
    const password = id;

    const role = req.query.role as ROLE  || ROLE.USER; 

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullname: displayName,
          avatar,
          password,
          role, 
        },
      });
    } else if (user.role !== role) {
      user = await this.prisma.user.update({
        where: { email },
        data: { role },
      });
    }

    done(null, user);
  }
}
