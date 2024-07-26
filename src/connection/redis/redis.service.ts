import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis, { RedisValue } from "ioredis";

@Injectable()
export class RedisService {
    private readonly client: Redis

    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = new Redis({
            host: this.configService.get('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT')
        }).once('ready', () => { console.log('Redis is ready') })
    }

    getClient(): Redis {
        return this.client
    }

    async preempt(key: string, timeout: number, value?: RedisValue): Promise<boolean> {
        return await this.client.set(key, value || 1, 'EX', timeout, 'NX') == 'OK'
    }
}