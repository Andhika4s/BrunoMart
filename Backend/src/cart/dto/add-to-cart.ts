import { IsString, IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty({ message: 'Product ID wajib diisi' })
  productId: string;

  @IsInt({ message: 'Jumlah barang harus berupa angka bulat' })
  @IsPositive({ message: 'Jumlah barang harus minimal 1' })
  quantity: number;
}

export class UpdateCartItemDto {
  @IsInt({ message: 'Jumlah barang harus berupa angka bulat' })
  @IsPositive({ message: 'Jumlah barang harus minimal 1' })
  quantity: number;
}