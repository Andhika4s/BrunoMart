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
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://bruno-mart.vercel.app', // Domain utama Vercel Anda
    ],
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