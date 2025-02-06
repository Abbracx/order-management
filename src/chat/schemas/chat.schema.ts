import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Order } from '../../order/schemas/order.schema';
import { Message } from './message.schema';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true,
  })
  order: Order;

  @Prop({ default: false })
  isClosed: boolean;

  @Prop()
  summary?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Message[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
