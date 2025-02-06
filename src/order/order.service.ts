import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderCreateInputDto, OrderUpdateInputDto } from './dto/order.dto';
import { CacheService } from '../cache/cache.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Order, OrderDocument } from './schemas/order.schema';
import { ChatService } from '../chat/chat.service';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cacheService: CacheService,
    @InjectQueue('orderQueue') private readonly orderQueue: Queue,
    private chatService: ChatService,
  ) {}

  async createOrder(data: OrderCreateInputDto, userId: string) {
    const order = new this.orderModel({
      ...data,
      metadata: {},
      user: userId,
    });
    await order.save();

    // Automatically open a chat room for the order
    const chatRoom = await this.chatService.createChatRoom(
      order._id.toString(),
      userId,
    );

    this.logger.log(`Order created: ${JSON.stringify(order)}`);
    this.logger.log(`Chat room created: ${JSON.stringify(chatRoom)}`);

    await this.orderQueue.add('notifyAdmins', {
      orderId: order._id,
      event: 'created',
    });

    return order;
  }

  async getOrderById(id: string) {
    const cacheKey = `order:${id}`;
    let order = await this.cacheService.get(cacheKey);
    if (!order) {
      order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      await this.cacheService.set(cacheKey, order);
    }
    this.logger.log(`Order retrieved: ${JSON.stringify(order)}`);
    return order;
  }

  async updateOrderStatus(
    id: string,
    status: OrderUpdateInputDto['status'],
    userId: string,
  ) {
    const isAdmin = await this.isAdmin(userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can update order status');
    }
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status: status as string }, { new: true })
      .exec();
    await this.cacheService.del(`order:${id}`);
    this.logger.log(`Order status updated: ${JSON.stringify(order)}`);
    await this.orderQueue.add('notifyUser', {
      orderId: id,
      event: 'statusUpdated',
      status,
    });
    return order;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    return user?.role === 'ADMIN';
  }
}
