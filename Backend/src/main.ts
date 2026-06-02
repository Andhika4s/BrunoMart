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

  // FIX CORS PRODUKSI (Menggunakan Array Matcher & Regex untuk Fleksibilitas Tanpa Crash)
  app.enableCors({
    origin: (origin, callback) => {
      // Jika request dikirim server-to-server (tidak ada header origin) atau localhost, langsung lolos
      if (!origin || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      // Validasi ketat domain Vercel Anda (bruno-mart.vercel.app ATAU subdomain git/preview-nya)
      const isVercelDomain = origin === 'https://bruno-mart.vercel.app' || 
                             origin.endsWith('.vercel.app');

      if (isVercelDomain) {
        callback(null, true);
      } else {
        // Alih-alih melempar error object yang bikin crash preflight, berikan false secara aman
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

  // Menggunakan env PORT bawaan Railway jika tersedia, atau fallback ke 5000
  await app.listen(process.env.PORT || 5000);
  console.log(`[BrunoMart Backend] Berhasil berjalan.`);
}

bootstrap();