import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async deactivateUser(userId: string){
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      await this.prisma.user.update({
        where: { id: userId },
        data: { status: 'INACTIVE' },
      });
      return { message: 'User deactivated successfully' };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          status: true,
        },
      });
  
      return { users };
  }
}
