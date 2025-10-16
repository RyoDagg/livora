import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    isCompany: boolean,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.create(
      email,
      password,
      name,
      isCompany,
    );
    const { access_token } = await this.signUser(user.id, user.email);
    return { access_token, user };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { access_token } = await this.signUser(user.id, user.email);
    return { access_token, user };
  }

  async signUser(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
