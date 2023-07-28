import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Controller()
export class AppController {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly appService: AppService) { }

  @Get()
  async getHello() {
    await this.redis.set('key', 'Redis data!');
    // await this.redis.del('key',)

    const redisData = await this.redis.get("key");
    // console.log("go")
    return { redisData };
  }
}


