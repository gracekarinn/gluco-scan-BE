import {
  Controller,
  UseGuards,
  Get,
  Post,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';
import { Product } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.productService.findAll(req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Post('submit')
  submitProduct(@Body() product: Product) {
    return this.productService.submitProduct(product);
  }

  @UseGuards(AccessTokenGuard)
  @Get('date')
  findByDate(@Req() req: Request) {
    return this.productService.findByToday(req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('gula')
  gulaBySevenDays(@Req() req: Request) {
    return this.productService.gulaBySevenDays(req.user['sub']);
  }
}
