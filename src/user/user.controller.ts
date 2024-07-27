import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { ResponseInterceptor } from '../interceptor'
import { UserService } from './user.service'

@Controller('/user')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser() {
    return this.userService.getAllUsers()
  }
}
