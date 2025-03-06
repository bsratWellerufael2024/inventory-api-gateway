import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins (change this to your frontend domain for security)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  const config = new DocumentBuilder()
    .setTitle('Product Microservice API')
    .setDescription('API documentation for the Product Microservice')
    .setVersion('1.0')
    .addBearerAuth() // For JWT authentication (optional)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger UI available at /api/docs
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
