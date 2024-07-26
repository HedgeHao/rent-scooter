import { Injectable } from "@nestjs/common";
import { RedisService } from "../connection/redis/redis.service";
import { CreateOrderDto } from "./order.dto";

@Injectable()
export class OrderService {
    constructor(
        private readonly redisService: RedisService
    ) {
    }

    async createOrderService(): Promise<CreateOrderDto.Response> {
        return new CreateOrderDto.Response()
    }
}