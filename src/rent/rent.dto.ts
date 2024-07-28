import { IsNumber } from 'class-validator'
import { RentEntity } from '../connection/postgres/entity/rent.entity'

type RentInfo = Pick<RentEntity, 'id' | 'startTime' | 'endTime' | 'reservationExpiredAt' | 'status'> & {
  userID: number
  scooterID: number
}

export const rentEntity2Info = (e: RentEntity): RentInfo =>
  <RentInfo>{
    id: e.id,
    startTime: e.startTime,
    endTime: e.endTime,
    reservationExpiredAt: e.reservationExpiredAt,
    status: e.status,
    userID: e.user.id,
    scooterID: e.scooter.id
  }

export namespace CreateRentDto {
  export class Request {
    @IsNumber()
    userID!: number

    @IsNumber()
    scooterID!: number
  }

  export type Response = RentInfo
}

export namespace StartRentDto {
  export class Request {
    @IsNumber()
    rentID!: number
  }

  export type Response = RentInfo
}

export namespace CancelRentDto {
  export class Request {
    @IsNumber()
    rentID!: number
  }

  export type Response = RentInfo
}

export namespace FinishRentDto {
  export class Request {
    @IsNumber()
    rentID!: number
  }

  export type Response = RentInfo
}
