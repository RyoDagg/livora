import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (user) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    const userId = req.user.userId;
    const updatedUser = await this.usersService.updateUser(userId, body);
    if (updatedUser) {
      const { password_hash, ...result } = updatedUser;
      return { ok: true, data: result };
    }
    return { ok: false, message: 'User not found' };
  }
}
