import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../users/users.service';
import { Order, OrderDocument } from './schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
@Processor('orderQueue')
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    private userService: UserService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Process('notifyAdmins')
  async handleOrderCreated(job: Job<{ orderId: string; event: string }>) {
    this.logger.log(
      `Handling order created with data: ${JSON.stringify(job.data)}`,
    );
    const { orderId, event } = job.data;
    this.logger.log(
      `Processing job to notify admins about order ${orderId} with event ${event}`,
    );

    // Notify available admins and assign to the order
    await this.userService.notifyAdmins(orderId);
    const admins = await this.userModel.find({ role: 'ADMIN' }).exec();

    if (admins.length > 0) {
      // Assign the first available admin to the order
      await this.orderModel
        .findByIdAndUpdate(orderId, { user: admins[0]._id })
        .exec();
      this.logger.log(`Order successfully assigned to admin: ${admins[0]._id}`);
    }
  }

  @Process('notifyUser')
  async handleOrderStatusUpdated(
    job: Job<{ orderId: string; event: string; status: string }>,
  ) {
    this.logger.log(
      `Handling order status update with data: ${JSON.stringify(job.data)}`,
    );
    const { orderId, event, status } = job.data;
    this.logger.log(
      `Processing job to notify user about order ${orderId} with event ${event} and status ${status}`,
    );

    // Fetch the order to get the userId
    const order = await this.orderModel
      .findById(orderId)
      .populate('user')
      .exec();

    if (order && order.user) {
      // Notify the user about the status update
      await this.userService.notifyUser(
        (order.user as UserDocument)._id.toString(),
        status,
      );
      this.logger.log(
        `User ${(order.user as UserDocument)._id} notified about order ${orderId} status: ${status}`,
      );
    } else {
      this.logger.warn(`Order ${orderId} or user not found`);
    }
  }

  @Process('chatRoomClosed')
  async handleChatRoomClosed(job: Job) {
    const chatRoom = job.data;
    this.logger.log(`Handling chatRoomClosed job for chat room ${chatRoom.id}`);
    // Move the associated order to the Processing state
    await this.orderModel
      .findByIdAndUpdate(chatRoom.orderId, { status: 'Delivered' })
      .exec();
    this.logger.log(
      `Chat room closed and order moved to Processing state: ${chatRoom.orderId}`,
    );
  }
}
