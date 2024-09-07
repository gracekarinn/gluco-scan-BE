import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const allowedOriginRegex = /https:\/\/glucoscan\.vercel\.app/;

  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === 'http://localhost:3000' ||
        allowedOriginRegex.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: '*',
  };

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001 || process.env.PORT);
}
bootstrap();
