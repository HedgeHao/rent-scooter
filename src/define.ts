export namespace Define {
    export namespace ScooterStatus {
        export const available = 0
        export const inUse = 1
        export const reserved = 2

        export type Type = typeof available | typeof inUse | typeof reserved
    }

    export namespace OrderStatus {
        export const cancelled = 0
        export const active = 1
        export const reserved = 2
        export const completed = 3

        export type Type = typeof cancelled | typeof active | typeof reserved | typeof completed
    }

    export namespace ResponseCode {
        export const fail = 500
        export const notExist = 404
        export const notLogin = 426
        export const ok = 200
        export type Type =
            | typeof fail
            | typeof notExist
            | typeof notLogin
            | typeof ok
    }
}