import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/data')
  findById(@Req() req: Request) {
    return this.usersService.findById(req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('update/membership')
  upgradeToPro(@Req() req: Request) {
    return this.usersService.upgradeToPro(req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('set/batasGula/:amount')
  setBatasGula(@Req() req: Request, @Param('amount') batasGula: number) {
    return this.usersService.setBatasGula(req.user['sub'], batasGula);
  }
}
