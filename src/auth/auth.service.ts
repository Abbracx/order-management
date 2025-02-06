import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async userRegister(username: string, password: string, email: string) {
    this.logger.log(`Registering user with username ${username}`);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = new this.userModel({
      username,
      password: hashedPassword,
      role: 'REGULAR',
      email,
    });
    const savedUser = await createdUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = savedUser.toObject();
    return result;
  }

  async adminRegister(username: string, password: string, email: string) {
    this.logger.log(`Registering admin with username ${username}`);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = new this.userModel({
      username,
      password: hashedPassword,
      role: 'ADMIN',
      email,
    });
    const savedUser = await createdUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = savedUser.toObject();
    return result;
  }

  async createToken(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
