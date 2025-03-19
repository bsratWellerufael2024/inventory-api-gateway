import { Controller, Post, Body, Inject,Get, Param, Delete, Patch } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { ClientProxy,Client,Transport } from '@nestjs/microservices';
import { UpdateUserDto } from 'src/dto/UpdateUserDto.dto';
import { Req,Res} from '@nestjs/common';
import { Response } from 'express';
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
  async login(@Body() createUserDto: CreateUserDTO, @Res() res: Response) {
    const payload = {
      uname: createUserDto.uname,
      password: createUserDto.password,
    };

    try {
      const response = await this.client.send('login', payload).toPromise();
      if (!response.success) {
        return res.status(401).json(response);
      }

      // Set HTTP-Only Secure Cookie in API Gateway
      res.cookie('jwt', response.data.accessToken, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // Protects against CSRF attacks
      });

      // Return user info (without token)
      return res.json({
        success: true,
        message: 'Login successful',
        data: { uname: response.data.uname, role: response.data.role },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
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
