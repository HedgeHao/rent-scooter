import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { ResponseInterceptor } from '../interceptor'
import { ScooterService } from './scooter.service'

@Controller('/scooter')
@UseInterceptors(ResponseInterceptor)
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Get()
  async getAllScooters() {
    return this.scooterService.getAllScooters()
  }
}
