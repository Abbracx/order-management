import {
  WebSocketGateway,
  // WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';

@WebSocketGateway({
  namespace: 'chats',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  // @WebSocketServer()
  // server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @SubscribeMessage('chats')
  async handleMessage(
    @MessageBody()
    data: {
      chatRoomId: string;
      userId: string;
      content: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Received message from user ${data.userId} in chat room ${data.chatRoomId}`,
    );
    // Handle the message
    const message = await this.chatService.sendMessage(
      data.chatRoomId,
      data.userId,
      data.content,
    );
    return message;
    // this.server.to(`chatRoom_${data.chatRoomId}`).emit('message', message);
  }

  @SubscribeMessage('chat')
  async handleJoinRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Client joined chat room ${data.chatRoomId}`);
    client.join(`chatRoom_${data.chatRoomId}`);
  }
}
