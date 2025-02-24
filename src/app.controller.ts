import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy,Transport,Client } from '@nestjs/microservices';
import { privateDecrypt } from 'crypto';
import { Observable } from 'rxjs';
@Controller()
export class AppController {
   constructor(@Inject('USERS_SERVICE')private readonly usersService:ClientProxy) {}
  @Client({
    transport: Transport.REDIS,
    options: {
      host:'127.0.0.1',
      port:6379 
    },
  })
  client: ClientProxy;

   @Get()
  getUsers() {
    const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
    console.log('Emitting user_created event with data:', userData);
     this.client.emit('user_created', userData); 
    return { message: 'User creation event emitted', data: userData };
  }
 

}
