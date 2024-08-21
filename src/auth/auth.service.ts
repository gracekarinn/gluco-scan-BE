import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

const dummyUser = {
  id: 1,
  email: 'grace',
  password: 'karin',
};

@Injectable()
export class AuthService {
  constructor(
    // Inject the UsersService
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!findUser) {
      throw new NotFoundException('User is not found.');
    }
    if (findUser.password === password) {
      const { password, ...user } = findUser;
      const accessToken = this.jwtService.sign(user);
      return { user, accessToken };
    } else {
      throw new UnauthorizedException('Invalid password.');
    }
  }

  async logout(user: User) {
    
  }
}
