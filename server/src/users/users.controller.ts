import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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
}
