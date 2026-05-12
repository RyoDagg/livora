import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { globalValidationPipe } from './common/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.APP_URL || 'https://www.livora.tn',
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(globalValidationPipe);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
