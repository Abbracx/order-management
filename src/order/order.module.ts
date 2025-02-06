import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProcessor } from './order.processor';
import { CacheService } from '../cache/cache.service';
import { CacheModule } from '../cache/cache.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ChatService } from '../chat/chat.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { Order, OrderSchema } from './schemas/order.schema';
import { ChatRoom, ChatRoomSchema } from '../chat/schemas/chat.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    CacheModule,
    BullModule.registerQueue({
      name: 'orderQueue',
    }),
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ChatModule,
  ],
  providers: [
    OrderService,
    CacheService,
    ChatService,
    OrderProcessor,
    ConfigService,
    AuthGuard,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
