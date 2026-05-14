import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    isCompany: boolean,
  ) {
    let user;
    try {
      user = await this.usersService.create(email, password, name, isCompany);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already exists',
        });
      }
      throw new InternalServerErrorException({
        code: 'REGISTER_FAILED',
        message: 'Could not create account',
      });
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await this.prismaService.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const verifyUrl = `${process.env.APP_URL || 'https://www.livora.tn'}/verify-email?token=${token}`;

    await this.mailService.sendMail({
      to: [email],
      subject: 'Verify your email',
      body: `Hello ${name},\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nThank you!\n\n- The Livora Team`,
    });

    await this.mailService.sendMail({
      to: ['livora.tn@gmail.com', 'mannai.abdlkader@gmail.com'],
      subject: 'New User Registration',
      body: `A new user has registered.\n\nName: ${name}\nEmail: ${email}\nIs Company: ${isCompany}\n\n- Livora System`,
    });

    const { access_token } = await this.signUser(user.id, user.email);
    return { access_token, user };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid)
      throw new UnauthorizedException('INVALID_CREDENTIALS');

    // if (!user.isVerified) throw new UnauthorizedException('EMAIL_NOT_VERIFIED');

    const { access_token } = await this.signUser(user.id, user.email);
    return { access_token, user };
  }

  async signUser(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(token: string) {
    const record = await this.prismaService.verificationToken.findUnique({
      where: { token },
    });
    if (!record) {
      throw new BadRequestException({
        code: 'INVALID_VERIFICATION_TOKEN',
        message: 'Invalid or expired token',
      });
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException({
        code: 'VERIFICATION_TOKEN_EXPIRED',
        message: 'Verification token expired',
      });
    }

    await this.prismaService.user.update({
      where: { id: record.userId },
      data: { isVerified: true },
    });

    await this.prismaService.verificationToken.delete({ where: { token } });
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    if (user.isVerified) {
      throw new BadRequestException({
        code: 'ALREADY_VERIFIED',
        message: 'Email is already verified',
      });
    }

    await this.prismaService.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await this.prismaService.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const verifyUrl = `${process.env.APP_URL || 'https://www.livora.tn'}/verify-email?token=${token}`;

    await this.mailService.sendMail({
      to: [email],
      subject: 'Verify your email',
      body: `Hello ${user.name},\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nThank you!\n\n- The Livora Team`,
    });
  }
}
