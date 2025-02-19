import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Extend Request type to include user property
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Extract token from cookies
    const token = request.cookies['access_token'];
    if (token) {
      request.headers['authorization'] = `Bearer ${token}`;
    }

    const isAuthenticated = (await super.canActivate(context)) as boolean;
    if (!isAuthenticated) return false;

    // Get the user from request (set by Passport)
    const user = request.user;
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid user authentication');
    }

    // Check user status from the database
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { status: true },
    });

    if (!dbUser || dbUser.status !== 'ACTIVE') {
      throw new UnauthorizedException('Your account is not active');
    }

    return true;
  }
}
