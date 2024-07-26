import { Controller, Delete, Post, Put, UseInterceptors } from "@nestjs/common";
import { RedisService } from "../connection/redis/redis.service";
import { ResponseInterceptor } from "../interceptor";

@Controller('/order')
@UseInterceptors(ResponseInterceptor)
export class OrderController {
    constructor(
        private readonly redisService: RedisService
    ) { }

    @Post('/create')
    async createOrder() {
        const lock = await this.redisService.preempt('lock', 30)
        console.log(lock ? 'Good to go' : 'Is Locked')
        return 'createOrder'
    }

    @Put('/rent_start')
    async rentStart() {
        return 'rentStart'
    }

    @Put('/rent_finish')
    async rentFinish() {
        return 'rentFinish'
    }

    @Delete('/cancel')
    async cancelOrder() {
        return 'cancelOrder'
    }
}