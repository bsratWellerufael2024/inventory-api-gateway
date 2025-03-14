import { Controller, Post, Body, Inject,Get, Param, Delete, Patch } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { ClientProxy,Client,Transport } from '@nestjs/microservices';
import { UpdateUserDto } from 'src/dto/UpdateUserDto.dto';
import { Req } from '@nestjs/common';
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

  @Post('/auth/signup')
  async createUser(@Body() createUserDto: CreateUserDTO) {
    if (!createUserDto.token) {
      console.log('access-token is missing at the payload');
    }
    const userData = {
      token: createUserDto.token,
      fname: createUserDto.fname,
      lname: createUserDto.lname,
      uname: createUserDto.uname,
      password: createUserDto.password,
      role: createUserDto.role,
    };
    console.log('Api-gateway', userData);
    return this.client.send('user-created', userData);
  }

  @Post('/auth/login')
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
  @Get('user/:id')
  async getOneUser(@Param('id') id: number) {
    return this.client.send('get-one-user', +id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.client.send('updateUser', { userId: id, updateUserDto });
  }

  @Delete('remove/:id')
  async delete(@Param('id') id: number) {
    return this.client.send('deleteUser', { userId: id });
  }
}
