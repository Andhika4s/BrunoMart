import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/add-to-cart';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, 
          },
        },
      },
    });

    if (!cart) {
      return { id: null, userId, items: [] };
    }
    return cart;
  }


  async addToCart(userId: string, dto: AddToCartDto) {
    const { productId, quantity } = dto;
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    if (product.stock < quantity) {
      throw new BadRequestException(`Stok tidak mencukupi. Sisa stok: ${product.stock}`);
    }
    const cart = await this.getOrCreateCart(userId);
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException(`Gagal menambah barang. Total di keranjangmu (${newQuantity}) melebihi stok toko (${product.stock}).`);
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }


    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  async updateItemQuantity(userId: string, cartItemId: string, dto: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });
    if (!cartItem) throw new NotFoundException('Item keranjang tidak ditemukan');
    if (cartItem.product.stock < dto.quantity) {
      throw new BadRequestException(`Stok tidak mencukupi. Maksimal pembelian: ${cartItem.product.stock}`);
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem) throw new NotFoundException('Item keranjang tidak ditemukan');

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    return { message: 'Barang berhasil dihapus dari keranjang' };
  }
  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { message: 'Keranjang berhasil dikosongkan' };
  }
}