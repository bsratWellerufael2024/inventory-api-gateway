import { Controller, Post, Body, Inject,Get, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { ClientProxy,Client,Transport } from '@nestjs/microservices';
import { UpdateUserDto } from 'src/dto/UpdateUserDto.dto';
import { Req,Res} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
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

  // @Post('/auth/login')
  // async login(@Body() createUserDto: CreateUserDTO, @Res() res: Response) {
  //   const payload = {
  //     uname: createUserDto.uname,
  //     password: createUserDto.password,
  //   };

  //   try {
  //     const response = await this.client.send('login', payload).toPromise();
  //     if (!response.success) {
  //       return res.status(401).json(response);
  //     }

  //     res.cookie('access_token', response.data.accessToken, {
  //       httpOnly: true, // Prevents XSS
  //       secure: process.env.NODE_ENV !== 'development', // Must be true for HTTPS
  //       sameSite: 'none', // Ensures cross-site access if needed
  //       path: '/', // Cookie available for the entire site
  //       domain: 'localhost', // Ensures correct domain
  //     });

  //     return res.json({
  //       success: true,
  //       message: 'Login successful',
  //       data: { uname: response.data.uname, role: response.data.role },
  //     });
  //   } catch (error) {
  //     console.error('Login error:', error.message);
  //     return res.status(500).json({
  //       success: false,
  //       message: 'Internal server error',
  //     });
  //   }
  // }

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

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          uname: response.data.uname,
          role: response.data.role,
          access_token: response.data.accessToken, // ✅ Return token in response body
        },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/all-users')
  async getAllUsers(@Req() request) {
    const token = request.headers.authorization?.split(' ')[1];
    return this.client.send('get-all-users', { token });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.json({ message: 'Logged out successfully' });
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
