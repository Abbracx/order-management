import {
  Controller,
  Post,
  Body,
  Logger,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './users.service';
import { AuthGuard } from '../common/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('register-push-token')
  async registerPushToken(
    @Body() body: { pushToken: string },
    @Req() req: any,
  ) {
    const userId = req.user._id;
    console.log(userId);
    this.logger.log(`Registering push token for user ${userId}`);
    return this.userService.registerPushToken(userId, body.pushToken);
  }

  @Get('regular')
  async getRegularUsers() {
    this.logger.log('Retrieving regular users');
    return this.userService.getRegularUsers();
  }

  @Get('regular/:id')
  async getRegularUser(@Param('id') id: string) {
    this.logger.log(`Retrieving regular user with id ${id}`);
    return this.userService.getRegularUserById(id);
  }

  @Get('admins')
  async getAdminUsers() {
    this.logger.log('Retrieving admin users');
    return this.userService.getAdminUsers();
  }

  @Get('admins/:id')
  async getAdminUser(@Param('id') id: string) {
    this.logger.log(`Retrieving admin user with id ${id}`);
    return this.userService.getAdminUserById(id);
  }
}
