import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  @ApiBody({ type: UserRegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.userRegister(
      userRegisterDto.username,
      userRegisterDto.password,
      userRegisterDto.email,
    );
  }

  @Post('register/admin')
  @ApiBody({ type: AdminRegisterDto })
  @ApiResponse({ status: 201, description: 'Admin successfully registered.' })
  async registerAdmin(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.authService.adminRegister(
      adminRegisterDto.username,
      adminRegisterDto.password,
      adminRegisterDto.email,
    );
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
