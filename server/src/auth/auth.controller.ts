import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token: { access_token: string } = await this.authService.register(
      email,
      password,
      name,
    );

    res.cookie('jwt_token', token.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return { message: 'Registration successful' };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token: { access_token: string } = await this.authService.login(
      email,
      password,
    );

    res.cookie('jwt_token', token.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return { message: 'Login successful' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt_token');
    return { message: 'Logout successful' };
  }
}
