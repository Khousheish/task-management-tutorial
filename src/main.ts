import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('bootstrap');
  const app: INestApplication = await NestFactory.create(AppModule);
  const port: number = 3000;
  const serverConfig = config.get('server');
  console.log(serverConfig);

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
