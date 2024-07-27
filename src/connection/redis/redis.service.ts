import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { RedisOptions, RedisValue } from 'ioredis'

@Injectable()
export class RedisService {
  private readonly client: Redis
  private readonly subscriber: Redis
  constructor(private readonly configService: ConfigService) {
    const redisConfig: RedisOptions = {
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT')
    }

    this.client = new Redis(redisConfig)

    this.subscriber = new Redis(redisConfig)
    this.subscriber.subscribe('__keyevent@0__:expired', (err, count) => {
      if (err) {
        console.error('Cannot subscribe', err)
      } else {
        this.subscriber.on('message', (channel: string, message: string) => {
          console.log(`${message} has expired`)
        })
      }
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
