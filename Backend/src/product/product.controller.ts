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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

@Controller('products')
export class ProductController {
  userService: any;
  orderService: any;
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

  @Get('stats/count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getStats() {
    const [userCount, productCount, orderCount] = await Promise.all([
      this.userService.countAll(),
      this.productService.countAll(),
      this.orderService.countAll(),
    ]);
    return {
      statusCode: 200,
      message: 'Berhasil mengambil statistik data',
      data: { users: userCount, products: productCount, orders: orderCount },
    };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Format file harus berupa gambar!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Foto produk wajib diunggah!');

    const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(filename, file.buffer, { contentType: file.mimetype });

    if (error) throw new BadRequestException('Gagal upload gambar: ' + error.message);

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filename);

    const data = await this.productService.create({
      ...createProductDto,
      image: urlData.publicUrl,
    });

    return { status: 'success', message: 'Produk berhasil ditambahkan', data };
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productService.update(id, updateProductDto);
    return { status: 'success', message: 'Produk berhasil diperbarui', data };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.remove(id);
    return { status: 'success', message: 'Produk berhasil dihapus' };
  }
}