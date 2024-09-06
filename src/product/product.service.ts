import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userId: string): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: { userId },
    });
  }

  async findById(productId: string): Promise<Product> {
    return this.prismaService.product.findUnique({
      where: { id: productId },
    });
  }

  async findByToday(userId: string): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  async gulaBySevenDays(userId: string): Promise<number[]> {
    const products = await this.prismaService.product.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          lte: new Date(),
        },
      },
    });

    const gulaBySevenDays = Array(7).fill(0);

    for (const product of products) {
      const index = Math.floor(
        (new Date(product.createdAt).getTime() -
          new Date(new Date().setDate(new Date().getDate() - 7)).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      gulaBySevenDays[index] += product.kadarGula;
    }

    return gulaBySevenDays;
  }

  async submitProduct(product: Product): Promise<void> {
    await this.prismaService.product.create({
      data: product,
    });
  }
}
