import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/user.controller';


@Module({
  imports: [ClientsModule.register([{
    transport:Transport.TCP,
    name:'USERS_SERVICE',
    options:{
      host:'127.0.0.1',
      port:6379
    }
  }])],
  controllers: [AppController,UsersController],
  providers: [AppService],
})
export class AppModule {}
