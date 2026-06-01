import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, // 💡 Tambahkan ini
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // 💡 Tambahkan ini
import { diskStorage } from 'multer'; // 💡 Tambahkan ini
import { extname } from 'path'; // 💡 Tambahkan ini
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

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
  @Roles('ADMIN')
  async getStats() {
    // 1. Ambil data count dari masing-masing service secara paralel
    const [userCount, productCount, orderCount] = await Promise.all([
      this.userService.countAll(),
      this.productService.countAll(), // Pastikan productService sudah di-inject di constructor
      this.orderService.countAll(),   // Pastikan orderService sudah di-inject di constructor
    ]);

    // 2. Kembalikan data dengan struktur { data: { users, products, orders } } 
    // agar langsung klop dengan dashboard frontend Next.js Anda
    return {
      statusCode: 200,
      message: 'Berhasil mengambil statistik data',
      data: {
        users: userCount,
        products: productCount,
        orders: orderCount,
      },
    };
  }
  // 🔒 ADMIN ONLY: Tambah Produk Baru + UPLOAD FOTO
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') 
  @UseInterceptors(
    FileInterceptor('image', { // ⚠️ 'image' ini wajib sama dengan Key di Postman kamu
      storage: diskStorage({
        destination: './uploads', // Gambar akan masuk ke folder /uploads di root proyek
        filename: (req, file, callback) => {
          // Membuat nama file unik berformat: image-timestamp.ekstensi
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Hanya menerima file gambar
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Format file harus berupa gambar (jpg/jpeg/png/webp)!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File, // 💡 Menangkap binary file gambar dari Postman
  ) {
    if (!file) {
      throw new BadRequestException('Foto produk (image) wajib diunggah!');
    }

    // Ambil string lokasi path file-nya (misal: uploads/image-12345.png)
    const imagePath = `uploads/${file.filename}`;

    // Kirim data ke service, dengan menyuntikkan path image dari server
    const data = await this.productService.create({
      ...createProductDto,
      image: imagePath,
    });

    return { status: 'success', message: 'Produk berhasil ditambahkan dengan foto', data };
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