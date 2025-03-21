import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS properly for frontend
  // app.enableCors({
  //   origin: 'http://localhost:5173', // Must match frontend
  //   credentials: true, // Allow cookies to be sent
  //   allowedHeaders: 'Content-Type, Authorization',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // });

app.enableCors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow cookies to be sent
  allowedHeaders: 'Content-Type, Authorization, access_token', // Allow 'access_token' header
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});

  // Enable cookie parsing
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Product Microservice API')
    .setDescription('API documentation for the Product Microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: '127.0.0.1',
      port: 6379,
      queue: 'users-service',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('🚀 API Gateway running on http://localhost:3000');
}
bootstrap();


