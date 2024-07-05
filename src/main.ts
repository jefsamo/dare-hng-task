import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '150mb' }));
  app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
