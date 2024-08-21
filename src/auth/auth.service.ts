import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    // Inject the UsersService
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(user: User) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (findUser) {
      throw new BadRequestException('User already exists.');
    }
    const newUser = await this.prismaService.user.create({ data: user });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login({ email, password }: AuthPayloadDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!findUser) {
      throw new NotFoundException('User is not found.');
    }
    if (findUser.password === password) {
      const tokens = await this.getTokens(findUser.id, findUser.email);
      await this.updateRefreshToken(findUser.id, tokens.refreshToken);
      return tokens;
    } else {
      throw new UnauthorizedException('Invalid password.');
    }
  }

  async logout(userId: string) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = user.refreshToken === refreshToken;
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '1d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
