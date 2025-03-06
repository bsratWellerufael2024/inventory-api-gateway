import { Controller, Post, Body, Inject,Get } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { ClientProxy,Client,Transport } from '@nestjs/microservices';
import { Req } from '@nestjs/common';
import { Request } from 'express';
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
  ) {}
  @Client({
    transport: Transport.REDIS,
    options: {
      host: '127.0.0.1',
      port: 6379,
    },
  })
  client: ClientProxy;
  @Post('/signup')
  createUser(@Body() createUserDto: CreateUserDTO) {
    const userData = {
      fname: createUserDto.fname,
      lname: createUserDto.lname,
      uname: createUserDto.uname,
      password: createUserDto.password,
      role: createUserDto.role,
    };
    console.log('Api-gateway', userData);
    this.client.send('user-created', userData);
  }

  @Post('/login')
  async login(@Body() createUserDto: CreateUserDTO) {
    const payload = {
      uname: createUserDto.uname,
      password: createUserDto.password,
    };
    return this.client.send('login', payload);
  }
  
  @Get('/all-users')
  async getAllUsers(@Req() request) {
    const token = request.headers.authorization?.split(' ')[1]; 
    return this.client.send('get-all-users', { token }); 
    
}
}
