import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ResponseInterceptor } from "src/interceptor";

@Controller('/user')
@UseInterceptors(ResponseInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    async getAllUser() {
        return this.userService.getAllUsers()
    }
}