import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { RedisValue } from 'ioredis'

@Injectable()
export class RedisService {
  private readonly client: Redis

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT')
    }).once('ready', () => {
      console.log('Redis is ready')
    })
  }

  getClient(): Redis {
    return this.client
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
