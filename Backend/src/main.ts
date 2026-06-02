import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; 
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  // JALUR STATIC ASSET
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // PERBAIKAN CORS: Masukkan origin domain Vercel Anda secara presisi
// PERBAIKAN CORS: Izinkan domain utama dan seluruh subdomain preview Vercel Anda
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://bruno-mart.vercel.app',
      ];
      
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  // Menggunakan env PORT bawaan Railway jika tersedia, atau fallback ke 5000
  await app.listen(process.env.PORT || 5000);
  console.log(`[BrunoMart Backend] Berhasil berjalan.`);
}

bootstrap();