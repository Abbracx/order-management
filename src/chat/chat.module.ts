import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
// import { ChatController } from './chat.controller';
import { AuthGuard } from '../auth/auth.guard';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ChatRoom, ChatRoomSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AuthGuard, ChatService, ChatGateway, JwtService],
  // controllers: [ChatController],
  exports: [ChatService, MongooseModule],
})
export class ChatModule {}
