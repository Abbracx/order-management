import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number = 3600) {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
