import { IsNumber } from 'class-validator'
import { RentEntity } from '../connection/postgres/entity/rent.entity'

export namespace CreateRentDto {
  export class Request {
    @IsNumber()
    userID!: number

    @IsNumber()
    scooterID!: number
  }

  export type Response = RentEntity
}

export namespace StartRentDto {
  export class Request {
    @IsNumber()
    rentID!: number
  }

  export type Response = RentEntity
}

export namespace CancelRentDto {
  export class Request {
    @IsNumber()
    rentID!: number
  }

  export type Response = RentEntity
}

export namespace FinishRentDto {
  export class Request {
    @IsNumber()
    rentID!: number
  }

  export type Response = RentEntity
}
