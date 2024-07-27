import { Body, Controller, Delete, Post, UseInterceptors } from '@nestjs/common'
import { ResponseInterceptor } from '../interceptor'
import { CancelRentDto, CreateOrderDto, FinishRentDto, StartRentDto } from './order.dto'
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
  async rentStart(@Body() body: StartRentDto.Request): Promise<StartRentDto.Response> {
    return await this.orderService.startRent(body)
  }

  @Post('/rent_finish')
  async rentFinish(@Body() body: FinishRentDto.Request): Promise<FinishRentDto.Response> {
    return await this.orderService.rentFinish(body)
  }

  @Delete('/cancel')
  async cancelOrder(@Body() body: CancelRentDto.Request): Promise<CancelRentDto.Response> {
    return await this.orderService.cancelReservation(body)
  }
}
