import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/user.controller';
import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { UnitConversionController } from './controllers/unitConversion.controller';
import { ProductControllerVariant } from './controllers/variant.controller';
import { InventoryController } from './controllers/inventory.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StockMonitorController } from './controllers/stock-monitor.controller';
import { NotificationController } from './controllers/notification.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    // // Microservices setup
    // ClientsModule.register([
    //   {
    //     transport: Transport.TCP,
    //     name: 'USERS_SERVICE',
    //     options: {
    //       host: '127.0.0.1',
    //       port: 6379,
    //     },
    //   },
    //   {
    //     transport: Transport.TCP,
    //     name: 'PRODUCT_SERVICE',
    //     options: {
    //       host: '127.0.0.1',
    //       port: 6379,
    //     },
    //   },
    // ]),

    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis', // 👈 This must match the Redis container name in docker-compose.yml
          port: 6379,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis', // 👈 Same here
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    UsersController,
    ProductController,
    CategoryController,
    UnitConversionController,
    ProductControllerVariant,
    InventoryController,
    StockMonitorController,
    NotificationController,
  ],
  providers: [AppService],
})
export class AppModule {}

