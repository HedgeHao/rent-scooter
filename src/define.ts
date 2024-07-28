import { isTestMode } from './util'

export namespace Define {
  export namespace Scooter {
    export namespace Status {
      export const available = 0
      export const inUse = 1
      export const reserved = 2
      export const offline = 3

      export type Type = typeof available | typeof inUse | typeof reserved | typeof offline
    }
  }

  export namespace ResponseCode {
    export const fail = 500
    export const notExist = 404
    export const notLogin = 426
    export const ok = 200
    export type Type = typeof fail | typeof notExist | typeof notLogin | typeof ok
  }

  export namespace RedisKey {
    export const scooterOccupiedPrefix = 'scooter_occupied_'
    export const scooterOccupiedLock = (scooterID: number) => `${scooterOccupiedPrefix}${scooterID}`
    export const userReservingPrefix = 'user_reserving_'
    export const userReservingLock = (userID: number) => `${userReservingPrefix}${userID}`
    export const reservationPrefix = 'reservation_'
    export const reservationLock = (rentID: number) => `${reservationPrefix}${rentID}`

    export type reservationHash = {
      userID: number
      scooterID: number
    }
    export const userRiddingLock = 'user_ridding_'
  }

  export namespace User {
    export namespace Status {
      export const free = 0
      export const reserved = 1
      export const ridding = 2

      export type Type = typeof free | typeof reserved | typeof ridding
    }
  }

  export namespace Rent {
    export const defaultReservedTimeout = isTestMode() ? 1 : 60

    export namespace Status {
      export const cancelled = 0
      export const active = 1
      export const reserved = 2
      export const completed = 3
      export const error = 4
      export const expired = 5

      export type Type = typeof cancelled | typeof active | typeof reserved | typeof completed | typeof error | typeof expired
    }
  }

  export namespace Kafka {
    export namespace Topic {
      export const rentComplete = isTestMode() ? 'test-rent-complete' : 'rent-complete'
    }

    export namespace Message {
      export class rentCompleteMessage {
        rentID: number
        userID: number
        scooterID: number
        startTime: number
        endTime: number
        status: number
      }

      export type Type = rentCompleteMessage
    }
  }
}
