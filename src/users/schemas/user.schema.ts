import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Order } from '../../order/schemas/order.schema';
import { Message } from '../../chat/schemas/message.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['ADMIN', 'REGULAR'] })
  role: string;

  @Prop()
  pushToken?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Order' }] })
  orders: Order[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];
}

export const UserSchema = SchemaFactory.createForClass(User);
