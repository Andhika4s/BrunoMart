import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Nama harus berupa teks.' })
  name?: string 

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password baru harus berupa teks.' })
  @MinLength(6, { message: 'Password baru minimal harus 6 karakter.' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Password lama harus berupa teks.' })
  oldPassword?: string;
}