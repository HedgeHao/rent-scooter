export namespace OrderReq {

}

export namespace CreateOrderDto {
    export class Request {
        userID: number
        scooterID: number
    }

    export class Response {
        orderID: number
    }
}
