import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
const path = require('path');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // FIX CORS PRODUKSI (Menggunakan Array Matcher & Wildcard Subdomain)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      const isVercelDomain = origin === 'https://bruno-mart.vercel.app' || 
                             origin.endsWith('.vercel.app');

      // Allow Railway deployment domain(s)
      const isRailwayDomain = origin === 'https://brunomart-production.up.railway.app' ||
                              origin.endsWith('.up.railway.app');

      if (isVercelDomain || isRailwayDomain) {
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

  // Swagger / OpenAPI setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BrunoMart API')
    .setDescription('Documentasi API untuk BrunoMart Backend')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  // Mount Swagger and respect the global prefix so docs are available at /api/docs
  SwaggerModule.setup('docs', app, swaggerDocument, { useGlobalPrefix: true });

  // Add a simple redirect from /docs to /api/docs for convenience
  app.use('/docs', (req, res) => res.redirect('/api/docs'));

  // --- PERBAIKAN UTAMA UNTUK RAILWAY (PORT & BINDING HOST) ---
  // Ambil PORT dari environment Railway, pastikan dikonversi ke integer
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  
  // Wajib tambahkan '0.0.0.0' agar kontainer mau menerima request dari proxy luar Railway
  await app.listen(port, '0.0.0.0');
  
  console.log(`[BrunoMart Backend] Berhasil berjalan di port: ${port} dengan host 0.0.0.0`);
}

bootstrap();