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

// Inisialisasi Supabase Client untuk handle berkas media/gambar
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

@ApiTags('Products')
@Controller('products')
export class ProductController {
  // Catatan: Pastikan UserService dan OrderService di-inject di constructor modul utama jika getStats digunakan riil
  constructor(
    private readonly productService: ProductService,
  ) {}
  @Get()
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
  async getStats() {
    // Fungsi pembantu jika admin dashboard memerlukan ringkasan metrik data
    const productCount = await this.productService.countAll();
    return {
      statusCode: 200,
      message: 'Berhasil mengambil statistik data produk',
      data: { products: productCount },
    };
  }

  @Get(':id')
  async getProductDetail(@Param('id') id: string) {
    const data = await this.productService.findOne(id);
    return { status: 'success', data };
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
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    // Skenario jika admin memutuskan untuk memperbarui berkas gambar produk
    if (file) {
      // 1. Dapatkan referensi data produk saat ini guna menghapus media lama dari cloud bucket
      const existingProduct = await this.productService.findOne(id);
      
      if (existingProduct && existingProduct.image) {
        try {
          const oldFilename = existingProduct.image.split('/').pop();
          if (oldFilename) {
            await supabase.storage.from('products').remove([oldFilename]);
          }
        }  catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      console.error('Gagal membersihkan gambar lama dari bucket Supabase:', errorMessage);
}
      }

      // 2. Unggah berkas gambar yang baru masuk ke Supabase Storage
      const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      const { error } = await supabase.storage
        .from('products')
        .upload(filename, file.buffer, { contentType: file.mimetype });

      if (error) throw new BadRequestException('Gagal upload gambar baru ke Supabase: ' + error.message);

      const { data: urlData } = supabase.storage.from('products').getPublicUrl(filename);
      imageUrl = urlData.publicUrl;
    }

    // 3. Teruskan payload data text & URL gambar baru ke level ProductService
    const data = await this.productService.update(id, updateProductDto, imageUrl);
    return { status: 'success', message: 'Produk berhasil diperbarui', data };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string) {
    // Ambil info produk untuk hapus gambar di Supabase sebelum row di tabel kehapus
    try {
      const product = await this.productService.findOne(id);
      if (product && product.image) {
        const filename = product.image.split('/').pop();
        if (filename) {
          await supabase.storage.from('products').remove([filename]);
        }
      }
    } 
    catch (e) {
  const errorMessage = e instanceof Error ? e.message : 'Unknown error';
  console.error('Gagal membersihkan gambar lama dari bucket Supabase:', errorMessage);
}

    await this.productService.remove(id);
    return { status: 'success', message: 'Produk berhasil dihapus' };
  }
}