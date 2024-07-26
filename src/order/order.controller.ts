import { Body, Controller, Delete, Post, Put, UseInterceptors } from "@nestjs/common";
import { ResponseInterceptor } from "../interceptor";
import { CreateOrderDto, OrderReq } from "./order.dto";
import { OrderService } from "./order.service";

@Controller('/order')
@UseInterceptors(ResponseInterceptor)
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }

    @Post('/create')
    async createOrder(@Body() body: CreateOrderDto.Request): Promise<CreateOrderDto.Response> {
        return await this.orderService.createOrderService()
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