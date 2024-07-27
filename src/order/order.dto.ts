import { IsNumber } from 'class-validator'
import { OrderEntity } from 'src/connection/postgres/entity/order.entity'

export namespace OrderReq {}

export namespace CreateOrderDto {
  export class Request {
    @IsNumber()
    userID!: number

    @IsNumber()
    scooterID!: number
  }

  export type Response = OrderEntity
}
