import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.userRegister(
      userRegisterDto.username,
      userRegisterDto.password,
      userRegisterDto.email,
    );
  }

  @Post('register/admin')
  async registerAdmin(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.authService.adminRegister(
      adminRegisterDto.username,
      adminRegisterDto.password,
      adminRegisterDto.email,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
