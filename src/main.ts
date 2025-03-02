import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Options } from '@nestjs/common';
async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 app.connectMicroservice({
   transport: Transport.REDIS,
   options: {
     host: '127.0.0.1',
     port: 6379,
     queue: 'users-service',
   },

 },
 
);

 await app.startAllMicroservices();
 await app.listen(3000);
 console.log('🚀 API Gateway running on http://localhost:3000');

}
bootstrap();
