import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
  }), UsersModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
