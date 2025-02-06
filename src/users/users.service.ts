import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from '../firebase/firebase.service';
import { User, UserDocument } from './schemas/user.schema';
import { Admin, Message, UserRole } from './interface/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async registerPushToken(userId: string, pushToken: string) {
    this.logger.log(`Registering push token for user ${userId}`);
    return this.userModel.findByIdAndUpdate(userId, { pushToken }).exec();
  }

  async notifyAdmins(orderId: string) {
    this.logger.log(`Notifying admins about new order ${orderId}`);

    const adminDocs = await this.userModel
      .find({ role: UserRole.ADMIN })
      .exec();

    const admins: Admin[] = adminDocs.map(
      (adminDoc) => adminDoc.toObject() as Admin,
    );
    // Notify all admins about the new order

    admins.forEach(async (admin: Admin) => {
      this.logger.log(
        `Notifying admin ${admin._id} about new order ${orderId}`,
      );
      const message: Message = {
        notification: {
          title: 'New Order',
          body: `A new order with ID ${orderId} has been placed.`,
        },
      };
      if (admin.pushToken) {
        await this.firebaseService.sendPushNotification(
          admin.pushToken,
          message,
        );
      }
    });
  }

  async notifyUser(userId: string, status: string) {
    this.logger.log(`Notifying user ${userId} about order status: ${status}`);
    const user = await this.userModel.findById(userId).exec();

    if (user && user.pushToken) {
      const message: Message = {
        notification: {
          title: 'Order Status Update',
          body: `Your order status has been updated to ${status}.`,
        },
      };
      await this.firebaseService.sendPushNotification(user.pushToken, message);
    } else {
      this.logger.warn(`User ${userId} not found or push token is missing`);
    }
  }

  async getRegularUsers() {
    this.logger.log('Retrieving regular users');
    return this.userModel.find({ role: 'REGULAR' }).exec();
  }

  async getAdminUsers() {
    this.logger.log('Retrieving admin users');
    return this.userModel.find({ role: 'ADMIN' }).exec();
  }

  async getRegularUserById(id: string) {
    this.logger.log(`Retrieving regular user with id ${id}`);
    return this.userModel.findOne({ _id: id, role: 'REGULAR' }).exec();
  }

  async getAdminUserById(id: string) {
    this.logger.log(`Retrieving admin user with id ${id}`);
    return this.userModel.findOne({ _id: id, role: 'ADMIN' }).exec();
  }
}
