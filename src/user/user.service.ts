import { Injectable } from "@nestjs/common";
import { UserEntity } from "../connection/postgres/entity/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async getAllUsers(): Promise<UserDto[]> {
        const users = await this.userRepository.find({ select: ['name', 'age', 'height'] }) as UserDto[]
        return users
    }
}