import { Controller, Delete, Post, Put } from "@nestjs/common";

@Controller('/order')
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