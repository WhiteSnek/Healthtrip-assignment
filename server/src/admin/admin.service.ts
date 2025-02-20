import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ROLE, STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async toggleUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });
  
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    const newStatus = user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
  
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });
  
    return newStatus;
  }
  

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      where: {
        role: ROLE.USER
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        status: true,
      },
    });
  
    return users;
  }
  
}
