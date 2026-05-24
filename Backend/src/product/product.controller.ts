import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
  ) {
    const data = await this.productService.findAll(search, category, sort);
    return { status: 'success', data };
  }


  @Get(':id')
  async getProductDetail(@Param('id') id: string) {
    const data = await this.productService.findOne(id);
    return { status: 'success', data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') 
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const data = await this.productService.create(createProductDto);
    return { status: 'success', message: 'Produk berhasil ditambahkan', data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productService.update(id, updateProductDto);
    return { status: 'success', message: 'Produk berhasil diperbarui', data };
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.remove(id);
    return { status: 'success', message: 'Produk berhasil dihapus' };
  }
}