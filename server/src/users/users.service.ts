import { Injectable } from '@nestjs/common';
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
}
