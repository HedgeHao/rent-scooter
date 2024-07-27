import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { RedisOptions, RedisValue } from 'ioredis'
import RedisMock from 'ioredis-mock'
import { isTestMode } from '../../util'

@Injectable()
export class RedisService {
  private readonly client: Redis
  private readonly subscriber: Redis
  constructor(private readonly configService: ConfigService) {
    const redisConfig: RedisOptions = {
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT')
    }
    if (isTestMode()) {
      this.client = new RedisMock()
      this.subscriber = new RedisMock()
    } else {
      this.client = new Redis(redisConfig)
      this.subscriber = new Redis(redisConfig)
    }
  }

  getClient(): Redis {
    return this.client
  }

  getSubscriber(): Redis {
    return this.subscriber
  }

  async lock(key: string, timeout?: number, value?: RedisValue): Promise<boolean> {
    if (timeout) {
      return (await this.client.set(key, value || 1, 'EX', timeout, 'NX')) === 'OK'
    } else {
      return (await this.client.set(key, value || 1, 'NX')) === 'OK'
    }
  }

  async unlock(key: string, value?: RedisValue): Promise<boolean> {
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `
    const result = await this.client.eval(script, 1, key, value || 1)
    return result === 1
  }
}
