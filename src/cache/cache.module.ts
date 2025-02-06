import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
