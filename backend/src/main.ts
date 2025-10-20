import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для работы с фронтендом
  app.enableCors();
  
  // Устанавливаем глобальный префикс для всех маршрутов
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Приложение запущено на порту ${port}`);
}

bootstrap();
