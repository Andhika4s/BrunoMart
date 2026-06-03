import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Req,
  HttpStatus
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/add-to-cart'; // Pastikan path benar
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cart')
@UseGuards(JwtAuthGuard) // 🔒 Semua akses cart wajib Login
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 1. GET: Lihat isi keranjang user yang sedang login
  @Get()
  async getMyCart(@Req() req: Request) {
    const user = req.user as { id: string };
    const data = await this.cartService.getCart(user.id);
    return { 
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil isi keranjang',
      data 
    };
  }

  // 2. POST: Tambah produk ke keranjang
  @Post()
  @ApiBearerAuth() // Pastikan user sudah login untuk menambahkan ke cart
  async addItemToCart(@Req() req: Request, @Body() addToCartDto: AddToCartDto) {
    const user = req.user as { id: string };
    const data = await this.cartService.addToCart(user.id, addToCartDto);
    return { 
      statusCode: HttpStatus.CREATED,
      message: 'Produk berhasil ditambahkan ke keranjang', 
      data 
    };
  }

  // 3. PUT: Update jumlah quantity produk di keranjang
  @Put(':itemId')
  async updateQuantity(
    @Req() req: Request,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const user = req.user as { id: string };
    const data = await this.cartService.updateItemQuantity(user.id, itemId, updateCartItemDto);
    return { 
      statusCode: HttpStatus.OK,
      message: 'Quantity berhasil diperbarui', 
      data 
    };
  }

  // 4. DELETE: Hapus item dari keranjang
  @Delete(':itemId')
  async removeItem(@Req() req: Request, @Param('itemId') itemId: string) {
    const user = req.user as { id: string };
    await this.cartService.removeItem(user.id, itemId);
    return { 
      statusCode: HttpStatus.OK, 
      message: 'Barang berhasil dihapus dari keranjang' 
    };
  }
}