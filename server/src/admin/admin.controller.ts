import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Patch(':userId')
    async deactivateUser(@Param('userId') userId: string) {
        return this.adminService.deactivateUser(userId)
    }

    @Get('')
    async getAllUsers() {
        return this.adminService.getAllUsers()
    }
}
