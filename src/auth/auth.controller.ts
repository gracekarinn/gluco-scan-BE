import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/getUser.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.validateUser(authPayload);
  }

  @Post('logout')
  async logout(@GetUser() user: User) {
    return this.authService.logout(user);
  }
}
