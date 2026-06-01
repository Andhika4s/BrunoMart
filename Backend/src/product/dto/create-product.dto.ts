import { IsString, IsNumber, IsPositive, IsInt, Min, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // <-- Impor ini untuk konversi tipe data otomatis

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  description: string;

  @IsNumber({}, { message: 'Harga harus berupa angka murni' })
  @IsPositive({ message: 'Harga harus lebih besar dari 0' })
  @Type(() => Number) // 💡 Mengubah string "150000" dari form-data menjadi angka 150000
  price: number;

  @IsInt({ message: 'Stok harus berupa angka bulat' })
  @Min(0, { message: 'Stok tidak boleh bernilai negatif' })
  @Type(() => Number) // 💡 Mengubah string "20" dari form-data menjadi angka 20
  stock: number;

  @IsOptional() // 💡 Dibuat opsional karena field diisi otomatis oleh backend lewat path file multer
  image?: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  category: string;
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateProductDto extends PartialType(CreateProductDto) {}