import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async checkout(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Keranjang belanja Anda masih kosong.');
      }
      let totalAmount = 0;
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(`Stok produk "${item.product.name}" tidak mencukupi.`);
        }
        totalAmount += item.product.price * item.quantity;
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          address: dto.address,              
          paymentMethod: dto.paymentMethod,  
          status: 'PENDING',
        },
      });

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            price: item.product.price, 
            quantity: item.quantity,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { 
        user: { select: { name: true, email: true } }, 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  
async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
  const order = await this.prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundException('Pesanan tidak ditemukan.');
  if (dto.status === 'CANCELLED' && order.status !== 'CANCELLED') {
    const orderItems = await this.prisma.orderItem.findMany({ where: { orderId } });
    
    for (const item of orderItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }, 
      });
    }
  }
  return this.prisma.order.update({
    where: { id: orderId },
    data: { status: dto.status as any },
  });
}
}