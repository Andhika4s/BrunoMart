import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async countAll(): Promise<number> {
    return await this.prisma.product.count(); // Sesuaikan nama model prisma Anda (misal: product atau info)
  }
  async findAll(search?: string, category?: string, sort?: string) {
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }
    
    let orderByClause: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderByClause = { price: 'asc' };
    if (sort === 'price_desc') orderByClause = { price: 'desc' };

    return this.prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
    }
    return product;
  }

  // 💡 PERBAIKAN DI METHOD CREATE
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        category: createProductDto.category,
        image: createProductDto.image || 'uploads/default.png', // Menjaga jika frontend lupa kirim gambar agar tidak null
      },
    });
  }

  // 💡 PERBAIKAN DI METHOD UPDATE (Agar jika admin edit barang tanpa ganti foto, fotonya tidak hilang)
  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); 
    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}