import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; // 💡 Pastikan ini sudah diimpor untuk static asset
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. SET GLOBAL PREFIX 'api'
  app.setGlobalPrefix('api');

  // 💡 JALUR STATIC ASSET: Mengizinkan foto produk diakses lewat browser/frontend
  // URL Akses: http://localhost:5000/uploads/nama-foto.jpg
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // 2. AKTIFKAN CORS (Izinkan port frontend Next.js milikmu)
  // Karena backend pindah ke 5000, port 3000 sekarang murni aman dipakai frontend Next.js
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true,
  });

  // 3. GLOBAL VALIDATION PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true, 
      transform: true, // ⚠️ DIUBAH KE TRUE! Agar string "20" dari form-data otomatis dikonversi ke angka bulat
    }),
  );

  // 💡 JALAN DI PORT 5000 (Tidak bentrok dengan Next.js)
  await app.listen(5000);
  console.log(`[BrunoMart Backend] Berhasil berjalan di: http://localhost:5000/api`);
}

bootstrap();