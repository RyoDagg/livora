import {
  NotFoundException,
  Controller,
  Get,
  Put,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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
  async updateProfile(
    @Request() req: any,
    @Body() body: UpdateUserDto,
  ) {
    const userId = req.user.userId;
    const updatedUser = await this.usersService.updateUser(userId, body);
    if (!updatedUser) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    const { password_hash, ...result } = updatedUser;
    return { ok: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/password')
  async updatePassword(
    @Request() req,
    @Body() body: UpdatePasswordDto,
  ) {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = body;

    return this.usersService.updatePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
