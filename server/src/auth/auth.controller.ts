import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { access_token, user } = await this.authService.register(
        body.email,
        body.password,
        body.name,
        body.isCompany,
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
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { access_token, user } = await this.authService.login(
        body.email,
        body.password,
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
  async verifyEmail(@Query() query: VerifyEmailDto) {
    try {
      await this.authService.verifyEmail(query.token);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: ResendVerificationDto) {
    try {
      await this.authService.resendVerificationEmail(body.email);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || 'SERVER_ERROR' };
    }
  }
}
