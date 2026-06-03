import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@Controller('orders')
@UseGuards(JwtAuthGuard) // Semua route wajib login JWT
export class OrderController {
  productService: any;
  userService: any;
  constructor(private readonly orderService: OrderService) {}

  // 🛍️ CUSTOMER: Proses Checkout
  @Post('checkout')
  @ApiBearerAuth() // Pastikan user sudah login untuk checkout
  async checkout(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const user = req.user as { id: string };
    const data = await this.orderService.checkout(user.id, createOrderDto);
    return { status: 'success', message: 'Pesanan berhasil dibuat, silahkan lakukan pembayaran', data };
  }

  @Get('stats/count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) 
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
      
  // 🛍️ CUSTOMER: Lihat Riwayat Belanja Saya
  @Get('my-orders')
  async getMyOrders(@Req() req: Request) {
    const user = req.user as { id: string };
    const data = await this.orderService.getMyOrders(user.id);
    return { status: 'success', data };
  }

  // 🔒 ADMIN ONLY: Pantau Semua Transaksi Masuk
  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) // Pastikan user sudah login
  @Roles('ADMIN')
  async getAllOrders() {
    const data = await this.orderService.getAllOrders();
    return { status: 'success', data };
  }

  // 🔒 ADMIN ONLY: Ubah Status Pengiriman / Pembayaran
  @Put('admin/:id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    const data = await this.orderService.updateStatus(id, dto);
    return { status: 'success', message: `Status pesanan berhasil diubah menjadi ${dto.status}`, data };
  }
}