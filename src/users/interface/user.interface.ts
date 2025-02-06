import { ObjectId } from 'mongodb';

export interface Admin {
  _id: ObjectId;
  email: string;
  username: string;
  role: 'ADMIN';
  pushToken?: string;
}

export interface Message {
  notification: {
    title: string;
    body: string;
  };
}

export enum UserRole {
  ADMIN = 'ADMIN',
  REGULAR = 'REGULAR',
}

export interface AUser {
  id: number;
  role: UserRole;
}

export interface ChatRoom {
  id: number;
}
