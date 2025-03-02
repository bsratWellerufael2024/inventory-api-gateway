import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/user.controller';
import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { UnitConversionController } from './controllers/unitConversion.controller';
import { ProductControllerVariant } from './controllers/variant.controller';
@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.TCP,
        name: 'USERS_SERVICE',
        options: {
          host: '127.0.0.1',
          port: 6379,
        },
      },
      {
        transport: Transport.TCP,
        name: 'PRODUCT_SERVICE',
        options: {
          host: '127.0.0.1',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController,ProductController,CategoryController,UnitConversionController,ProductControllerVariant],
  providers: [AppService],
})
export class AppModule {}
