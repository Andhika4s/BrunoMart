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

  // FIX CORS PRODUKSI (Menggunakan Array Matcher & Wildcard Subdomain)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      const isVercelDomain = origin === 'https://bruno-mart.vercel.app' || 
                             origin.endsWith('.vercel.app');

      if (isVercelDomain) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  // --- PERBAIKAN UTAMA UNTUK RAILWAY (PORT & BINDING HOST) ---
  // Ambil PORT dari environment Railway, pastikan dikonversi ke integer
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  
  // Wajib tambahkan '0.0.0.0' agar kontainer mau menerima request dari proxy luar Railway
  await app.listen(port, '0.0.0.0');
  
  console.log(`[BrunoMart Backend] Berhasil berjalan di port: ${port} dengan host 0.0.0.0`);
}

bootstrap();