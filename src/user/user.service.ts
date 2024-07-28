import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../connection/postgres/entity/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    const users = (await this.userRepository.find({ select: ['id', 'name', 'status'] })) as UserDto[]
    return users
  }
}
