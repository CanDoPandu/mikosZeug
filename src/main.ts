// Setup crypto polyfill before any imports
import { setupCryptoPolyfill } from './crypto-polyfill';
setupCryptoPolyfill();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
