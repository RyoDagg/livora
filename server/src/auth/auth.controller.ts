import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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
    @Body('isCompany') isCompany: boolean,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { access_token, user } = await this.authService.register(
        email,
        password,
        name,
        isCompany,
      );

      res.cookie('jwt_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      return { ok: true, user };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { access_token, user } = await this.authService.login(
        email,
        password,
      );

      res.cookie('jwt_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: error.message || 'SERVER_ERROR' };
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt_token');
    return { message: 'Logout successful' };
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    try {
      await this.authService.verifyEmail(token);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    try {
      await this.authService.resendVerificationEmail(email);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || 'SERVER_ERROR' };
    }
  }
}
