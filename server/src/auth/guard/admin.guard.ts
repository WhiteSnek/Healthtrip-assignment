import { ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLE, STATUS } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: { id: string }; 
}

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    
    const token = request.cookies['access_token'] || request.headers['authorization'];
    if (token) {
      request.headers['authorization'] = `Bearer ${token}`;
    }
    // Authenticate user
    const isAuthenticated = (await super.canActivate(context)) as boolean;
    if (!isAuthenticated) return false;

    const user = request.user;
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid user authentication');
    }

    // Fetch user role from database
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, status: true },
    });

    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }

    if (dbUser.status !== STATUS.ACTIVE) {
      throw new UnauthorizedException('Your account is not active');
    }

    if (dbUser.role !== ROLE.ADMIN) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
