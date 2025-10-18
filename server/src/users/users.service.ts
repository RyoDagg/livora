import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    email: string,
    password: string,
    name?: string,
    isCompany?: boolean,
  ) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password_hash: hashed, name, isCompany },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(userId: string, data: any) {
    const { email, password_hash, id, createdAt, updatedAt, ...rest } = data;

    return this.prisma.user.update({
      where: { id: userId },
      data: rest,
    });
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );
    if (!passwordValid) {
      throw new HttpException(
        'Incorrect current password',
        HttpStatus.FORBIDDEN,
      );
    }

    // Prevent setting same password
    const isSame = await bcrypt.compare(newPassword, user.password_hash);
    if (isSame) {
      throw new HttpException(
        'New password must be different',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashed },
    });

    return { ok: true, message: 'Password updated successfully' };
  }
}
