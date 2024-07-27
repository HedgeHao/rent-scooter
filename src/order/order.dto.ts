import { IsNumber } from 'class-validator'
import { OrderEntity } from 'src/connection/postgres/entity/order.entity'

export namespace CreateOrderDto {
  export class Request {
    @IsNumber()
    userID!: number

    @IsNumber()
    scooterID!: number
  }

  export type Response = OrderEntity
}

export namespace StartRentDto {
  export class Request {
    @IsNumber()
    orderID!: number

    @IsNumber()
    userID!: number

    @IsNumber()
    scooterID!: number
  }

  export type Response = OrderEntity
}

export namespace CancelRentDto {
  export class Request {
    @IsNumber()
    orderID!: number

    @IsNumber()
    userID!: number

    @IsNumber()
    scooterID!: number
  }

  export type Response = OrderEntity
}
