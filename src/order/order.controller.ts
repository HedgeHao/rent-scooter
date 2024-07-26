import { Controller, Delete, Post, Put, UseInterceptors } from "@nestjs/common";
import { ResponseInterceptor } from "src/interceptor";

@Controller('/order')
@UseInterceptors(ResponseInterceptor)
export class OrderController {
    @Post('/create')
    async createOrder() {
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