import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { createClient } from '@supabase/supabase-js';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan daftar semua produk' })
  async getAllProducts(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
  ) {
    const data = await this.productService.findAll(search, category, sort);
    return { status: 'success', data };
  }

  @Get('stats/count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Statistik jumlah produk (Admin Only)' })
  async getStats() {
    const productCount = await this.productService.countAll();
    return {
      statusCode: 200,
      message: 'Berhasil mengambil statistik data produk',
      data: { products: productCount },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan detail produk' })
  async getProductDetail(@Param('id') id: string) {
    const data = await this.productService.findOne(id);
    return { status: 'success', data };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        category: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['name', 'description', 'price', 'stock', 'category', 'image'],
    },
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Foto produk wajib diunggah!');

    const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    const { error } = await supabase.storage.from('products').upload(filename, file.buffer, { contentType: file.mimetype });

    if (error) throw new BadRequestException('Gagal upload gambar: ' + error.message);

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(filename);

    const data = await this.productService.create({ ...createProductDto, image: urlData.publicUrl });
    return { status: 'success', message: 'Produk berhasil ditambahkan', data };
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        category: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    if (file) {
      const existingProduct = await this.productService.findOne(id);
      if (existingProduct?.image) {
        const oldFilename = existingProduct.image.split('/').pop();
        if (oldFilename) await supabase.storage.from('products').remove([oldFilename]);
      }

      const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      const { error } = await supabase.storage.from('products').upload(filename, file.buffer, { contentType: file.mimetype });
      if (error) throw new BadRequestException('Gagal upload gambar baru: ' + error.message);
      
      const { data: urlData } = supabase.storage.from('products').getPublicUrl(filename);
      imageUrl = urlData.publicUrl;
    }

    const data = await this.productService.update(id, updateProductDto, imageUrl);
    return { status: 'success', message: 'Produk berhasil diperbarui', data };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    if (product?.image) {
      const filename = product.image.split('/').pop();
      if (filename) await supabase.storage.from('products').remove([filename]);
    }
    await this.productService.remove(id);
    return { status: 'success', message: 'Produk berhasil dihapus' };
  }
}