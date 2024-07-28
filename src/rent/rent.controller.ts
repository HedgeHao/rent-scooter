import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ResponseInterceptor } from '../interceptor'
import { CancelRentDto, CreateRentDto, FinishRentDto, StartRentDto } from './rent.dto'
import { RentService } from './rent.service'

@Controller('/rent')
@UseInterceptors(ResponseInterceptor)
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post('/reserve')
  async reserve(@Body() body: CreateRentDto.Request): Promise<CreateRentDto.Response> {
    return await this.rentService.reserve(body)
  }

  @Post('/start')
  async rentStart(@Body() body: StartRentDto.Request): Promise<StartRentDto.Response> {
    return await this.rentService.startRent(body)
  }

  @Post('/finish')
  async rentFinish(@Body() body: FinishRentDto.Request): Promise<FinishRentDto.Response> {
    return await this.rentService.rentFinish(body)
  }

  @Post('/cancel')
  async cancelRent(@Body() body: CancelRentDto.Request): Promise<CancelRentDto.Response> {
    return await this.rentService.cancelReservation(body)
  }
}
