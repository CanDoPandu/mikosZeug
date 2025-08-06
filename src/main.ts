import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Ensure crypto is available globally for TypeORM
if (typeof globalThis.crypto === 'undefined') {
  const { webcrypto } = eval('require')('crypto');
  globalThis.crypto = webcrypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
