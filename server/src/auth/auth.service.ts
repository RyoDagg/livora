import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

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
    const user = await this.usersService.create(
      email,
      password,
      name,
      isCompany,
    );

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
      to: email,
      subject: 'Verify your email',
      body: `Hello ${name},\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nThank you!\n\n- The Livora Team`,
    });
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
    if (!record) throw new Error('Invalid or expired token');

    if (record.expiresAt < new Date()) {
      throw new Error('Verification token expired');
    }

    await this.prismaService.user.update({
      where: { id: record.userId },
      data: { isVerified: true },
    });

    await this.prismaService.verificationToken.delete({ where: { token } });
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new Error('NOT_FOUND');
    if (user.isVerified) throw new Error('ALREADY_VERIFIED');

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
      to: email,
      subject: 'Verify your email',
      body: `Hello ${user.name},\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nThank you!\n\n- The Livora Team`,
    });
  }
}
