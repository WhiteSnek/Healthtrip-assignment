import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Patch(':userId')
    async toggleUserStatus(@Param('userId') userId: string) {
        return this.adminService.toggleUserStatus(userId)
    }

    @Get('')
    async getAllUsers() {
        return this.adminService.getAllUsers()
    }
}
