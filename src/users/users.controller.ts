import {
  Controller,
  Post,
  Body,
  Req,
  Logger,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { AuthGuard } from '../common/auth.guard';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('register-push-token')
  @ApiBody({ type: RegisterPushTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Push token successfully registered.',
  })
  async registerPushToken(@Body() body: RegisterPushTokenDto, @Req() req: any) {
    const userId = req.user._id;
    this.logger.log(`Registering push token for user ${userId}`);
    return this.userService.registerPushToken(userId, body.pushToken);
  }

  @Get('regular')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved regular users.',
  })
  async getRegularUsers() {
    this.logger.log('Retrieving regular users');
    return this.userService.getRegularUsers();
  }

  @Get('regular/:id')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved regular user.',
  })
  @ApiResponse({ status: 404, description: 'Regular user not found.' })
  async getRegularUser(@Param('id') id: string) {
    this.logger.log(`Retrieving regular user with id ${id}`);
    return this.userService.getRegularUserById(id);
  }

  @Get('admins')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved admin users.',
  })
  async getAdminUsers() {
    this.logger.log('Retrieving admin users');
    return this.userService.getAdminUsers();
  }

  @Get('admins/:id')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved admin user.',
  })
  @ApiResponse({ status: 404, description: 'Admin user not found.' })
  async getAdminUser(@Param('id') id: string) {
    this.logger.log(`Retrieving admin user with id ${id}`);
    return this.userService.getAdminUserById(id);
  }
}
