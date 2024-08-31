import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly PrismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.PrismaService.user.findMany();
  }

  async findById(userId: string): Promise<User> {
    return this.PrismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async update(id: string, updateUserDto: User): Promise<User> {
    return this.PrismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
