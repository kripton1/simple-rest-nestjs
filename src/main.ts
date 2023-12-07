import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.use(compression())

  const configService = app.get(ConfigService);

  await app.listen(+configService.get<number>('PORT'));
  console.log(`--- WebServer available on http://localhost:${+configService.get<number>('PORT')}`)
}
bootstrap();
