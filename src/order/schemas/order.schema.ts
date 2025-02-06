import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
// import { ChatRoom } from '../../chat/schemas/chat.schema';
@Schema()
export class Order {
  // @Prop({ required: true })
  // customerName: string;

  @Prop({ required: true })
  item: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({
    required: false,
    enum: ['Review', 'Dispatched', 'In Transit', 'Delivered'],
    default: 'Review',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  // @Prop({ type: Types.ObjectId, ref: 'ChatRoom' })
  // chatRoom?: ChatRoom;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
