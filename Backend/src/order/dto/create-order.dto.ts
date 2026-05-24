import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Alamat pengiriman (address) wajib diisi' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Metode pembayaran (paymentMethod) wajib diisi' })
  paymentMethod: string; 
}

import { IsIn } from 'class-validator';
export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'], {
    message: 'Status harus berupa: PENDING, PAID, SHIPPED, COMPLETED, atau CANCELLED',
  })
  status: string;
}