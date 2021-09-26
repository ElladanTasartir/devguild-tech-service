import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import './config';
import { port, rabbitmq } from './config';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmq.connectionString],
      queue: rabbitmq.technologiesProcessorQueue,
    },
  });

  await app.startAllMicroservices();
  app.listen(port, () => {
    logger.verbose(`Application running on port ${port}`);
  });
}
bootstrap();
