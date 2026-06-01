import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @Roles(Role.ADMIN) 
  async findAll() {
    const users = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil semua data pengguna.',
      data: users,
    };
  }

  @Get('profile')
    @UseGuards(JwtAuthGuard)
      async getMyProfile(@Req() req: Request) {
        const user = req.user as { id: string };
        const data = await this.userService.findOne(user.id);
    return { statusCode: HttpStatus.OK, data };
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil data pengguna.',
      data: user,
    };
  }

// Tambahkan endpoint ini untuk statistik
  @Get('stats/count')
  @Roles(Role.ADMIN)
  async getStats() {
    const userCount = await this.userService.countAll();
    // Jika Anda punya ProductService, panggil di sini juga
    // const productCount = await this.productService.countAll(); 
    
    return {
      statusCode: HttpStatus.OK,
      data: {
        users: userCount,
        // products: productCount,
      },
    };
  }


  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profil berhasil diperbarui.',
      data: updatedUser,
    };
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteMyAccount(@Req() req: Request) {
    const user = req.user as { id: string; email: string };    
    if (!user || !user.id) {
      throw new BadRequestException('Sesi user tidak valid.');
    }
    const result = await this.userService.deleteAccount(user.id);
    return {
      status: 'success',
      message: 'Akun Anda berhasil dihapus dari sistem BrunoMart.',
    };
  }

 //ADMIN ONLY
  @Put(':id/role')
  @Roles(Role.ADMIN) 
  async updateRole(
    @Param('id') id: string,
    @Body('role') newRole: Role,
  ) {
    const updatedUser = await this.userService.updateRole(id, newRole);
    return {
      statusCode: HttpStatus.OK,
      message: `Role pengguna berhasil diubah menjadi ${newRole}.`,
      data: updatedUser,
    };
  }

  //ADMIN ONLY
  @Delete(':id')
  @Roles(Role.ADMIN) 
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}