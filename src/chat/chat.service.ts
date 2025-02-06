import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom, ChatRoomDocument } from './schemas/chat.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async isValidUser(userId: string): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} is valid`);
    const user = await this.userModel.findById(userId).exec();
    return user?.role === 'REGULAR';
  }

  async isAdmin(userId: string): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} is an admin`);
    const user = await this.userModel.findById(userId).exec();
    return user?.role === 'ADMIN';
  }

  async createChatRoom(orderId: string, userId: string) {
    this.logger.log(
      `Creating chat room for order ${orderId} by user ${userId}`,
    );
    const isUser = await this.isValidUser(userId);
    const isAdmin = await this.isAdmin(userId);
    if (!isUser || !isAdmin) {
      this.logger.warn(`User ${userId} is neither a user nor an admin`);
      throw new ForbiddenException(
        'Only users and admins can create chat rooms',
      );
    }
    const chatRoom = new this.chatRoomModel({
      order: orderId,
    });
    await chatRoom.save();

    this.logger.log(`Chat room ${chatRoom._id} created for order ${orderId}`);
    return chatRoom;
  }

  async sendMessage(chatRoomId: string, userId: string, content: string) {
    this.logger.log(
      `User ${userId} sending message to chat room ${chatRoomId}`,
    );
    const isUser = await this.isValidUser(userId);
    const isAdmin = await this.isAdmin(userId);
    if (!isUser || !isAdmin) {
      this.logger.warn(`User ${userId} is neither a user nor an admin`);
      throw new ForbiddenException('Only users and admins can send messages');
    }
    const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec();
    if (chatRoom && chatRoom?.isClosed) {
      throw new ForbiddenException(
        'Cannot send messages to a closed chat room',
      );
    }
    const message = new this.messageModel({
      content,
      user: userId,
      chatRoom: chatRoomId,
    });
    await message.save();

    this.logger.log(
      `Message sent to chat room ${chatRoomId} by user ${userId}`,
    );
    return message;
  }

  async closeChatRoom(chatRoomId: string, summary: string, userId: string) {
    this.logger.log(`User ${userId} closing chat room ${chatRoomId}`);
    const isAdmin = await this.isAdmin(userId);
    if (!isAdmin) {
      this.logger.warn(`User ${userId} is not an admin`);
      throw new ForbiddenException('Only admins can close chat rooms');
    }
    const chatRoom = await this.chatRoomModel
      .findByIdAndUpdate(chatRoomId, { isClosed: true, summary }, { new: true })
      .exec();

    this.logger.log(`Chat room ${chatRoomId} closed by user ${userId}`);
    return chatRoom;
  }
}
