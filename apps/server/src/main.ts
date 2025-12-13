import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS 以支持前端应用
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3001', // Next.js 可能自动切换端口
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
