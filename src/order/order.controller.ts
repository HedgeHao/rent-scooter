import { Body, Controller, Delete, Post, UseInterceptors } from '@nestjs/common'
import { ResponseInterceptor } from '../interceptor'
import { CreateOrderDto, StartRentDto } from './order.dto'
import { OrderService } from './order.service'

@Controller('/order')
@UseInterceptors(ResponseInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  async createOrder(@Body() body: CreateOrderDto.Request): Promise<CreateOrderDto.Response> {
    return await this.orderService.createOrderService(body)
  }

  @Post('/rent_start')
  async rentStart(@Body() body: StartRentDto.Request) {
    return await this.orderService.startRent(body)
  }

  @Post('/rent_finish')
  async rentFinish() {
    return 'rentFinish'
  }

  @Delete('/cancel')
  async cancelOrder() {
    return 'cancelOrder'
  }
}
