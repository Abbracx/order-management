import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Req,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CloseChatDto } from './dto/chat.dto';
import { AuthGuard } from '../common/auth.guard';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  async createChatRoom(@Body() data: CreateChatDto, @Req() req: any) {
    const userId = req.user.userId;
    this.logger.log(
      `User ${userId} is creating a chat room for order ${data.orderId}`,
    );
    const result = await this.chatService.createChatRoom(data.orderId, userId);
    this.logger.log(`Chat room created successfully for order ${data.orderId}`);
    return result;
  }

  @Patch(':id/close')
  async closeChatRoom(
    @Param('id') id: string,
    @Body() data: CloseChatDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    this.logger.log(
      `User ${userId} is closing chat room ${id} with summary: ${data.summary}`,
    );
    const result = await this.chatService.closeChatRoom(
      id,
      data.summary,
      userId,
    );
    this.logger.log(`Chat room ${id} closed successfully`);
    return result;
  }
}
