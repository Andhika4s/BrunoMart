// src/user/user.service.ts

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}

  // ─── ADMIN: Get all users ────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.user.findMany({
      select: USER_SAFE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Get single user by ID ───────────────────────────────────────────────────

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SAFE_SELECT,
    });

    if (!user) throw new NotFoundException('User tidak ditemukan.');
    return user;
  }

  // ─── Update profile (name, email, password) ──────────────────────────────────

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan.');

    const updateData: Prisma.UserUpdateInput = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.email) updateData.email = dto.email;

    if (dto.password) {
      if (!dto.oldPassword) {
        throw new BadRequestException(
          'Password lama wajib diisi untuk mengganti password baru.',
        );
      }

      const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Password lama yang kamu masukkan salah.');
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(dto.password, salt);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: USER_SAFE_SELECT,
    });
  }

  // ─── ADMIN: Update role user ─────────────────────────────────────────────────

  async updateRole(id: string, newRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User target tidak ditemukan.');

    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  // ─── ADMIN: Delete user ──────────────────────────────────────────────────────

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan.');

    await this.prisma.user.delete({ where: { id } });

    return { message: `User dengan id ${id} berhasil dihapus.` };
  }

async findByEmail(email: string) {
  return this.prisma.user.findUnique({ where: { email } });
  }

  async deleteAccount(userId: string) {
  const activeOrders = await this.prisma.order.findMany({
    where: {
      userId: userId,
      status: { in: ['PENDING', 'PAID', 'SHIPPED'] }
    }
  });
  if (activeOrders.length > 0) {
    throw new BadRequestException('Tidak bisa menghapus akun karena ada transaksi yang sedang berjalan.');
  }
  return this.prisma.user.delete({ where: { id: userId } });
}
}