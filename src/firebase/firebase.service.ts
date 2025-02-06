import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private configService: ConfigService) {
    this.initializeFirebaseApp();
  }

  private initializeFirebaseApp() {
    if (admin.apps.length === 0) {
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
      if (!privateKey) {
        throw new Error('FIREBASE_PRIVATE_KEY is not defined');
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      this.logger.log('Firebase app initialized');
    } else {
      this.logger.log('Firebase app already initialized');
    }
  }

  async sendPushNotification(
    token: string,
    message: admin.messaging.MessagingPayload,
  ) {
    return admin.messaging().send({
      token: token,
      ...message,
    });
  }
}
