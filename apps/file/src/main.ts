import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api/file');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
