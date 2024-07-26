import { OrderEntity } from 'src/connection/postgres/entity/order.entity'

export namespace OrderReq {}

export namespace CreateOrderDto {
  export class Request {
    userID: number
    scooterID: number
  }

  export type Response = OrderEntity
}
