import { IsString, IsNumber, IsPositive, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  description: string;

  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @IsPositive({ message: 'Harga harus lebih besar dari 0' })
  price: number;

  @IsInt({ message: 'Stok harus berupa angka bulat' })
  @Min(0, { message: 'Stok tidak boleh bernilai negatif' })
  stock: number;

  @IsString()
  @IsNotEmpty({ message: 'URL gambar tidak boleh kosong' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  category: string;
}


import { PartialType } from '@nestjs/mapped-types';
export class UpdateProductDto extends PartialType(CreateProductDto) {}