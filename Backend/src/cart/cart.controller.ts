import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/add-to-cart';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import express from 'express';

@Controller('cart')
@UseGuards(JwtAuthGuard) 
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getMyCart(@Req() req: express.Request) {
    const user = req.user as { id: string };
    const data = await this.cartService.getCart(user.id);
    return { status: 'success', data };
  }


  @Post()
  async addItemToCart(@Req() req: express.Request, @Body() addToCartDto: AddToCartDto) {
    const user = req.user as { id: string };
    const data = await this.cartService.addToCart(user.id, addToCartDto);
    return { status: 'success', message: 'Produk berhasil dimasukkan ke keranjang', data };
  }

  @Put(':itemId')
  async updateQuantity(
    @Req() req: express.Request,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const user = req.user as { id: string };
    const data = await this.cartService.updateItemQuantity(user.id, itemId, updateCartItemDto);
    return { status: 'success', message: 'Jumlah barang berhasil diperbarui', data };
  }


  @Delete(':itemId')
  async removeItem(@Req() req: express.Request, @Param('itemId') itemId: string) {
    const user = req.user as { id: string };
    await this.cartService.removeItem(user.id, itemId);
    return { status: 'success', message: 'Barang berhasil dihapus dari keranjang' };
  }
}