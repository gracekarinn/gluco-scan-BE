import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

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

  async upgradeToPro(id: string): Promise<void> {
    await this.PrismaService.user.update({
      where: { id },
      data: {
        isPro: true,
        proUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async checkMembership(id: string): Promise<void> {
    const user = await this.PrismaService.user.findUnique({
      where: { id },
    });

    if (user.isPro) {
      const now = new Date();
      if (user.proUntil && now > user.proUntil) {
        await this.PrismaService.user.update({
          where: { id },
          data: { isPro: false, proUntil: null },
        });
      }
    }
  }

  @Cron('0 0 * * *') // Runs every day at midnight
  async handleMembershipDowngrade() {
    // Fetch all users and check their membership status
    const users = await this.PrismaService.user.findMany();
    for (const user of users) {
      await this.checkMembership(user.id);
    }
  }
}
