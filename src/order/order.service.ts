import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Define } from 'src/define'
import { Repository } from 'typeorm'
import { OrderEntity } from '../connection/postgres/entity/order.entity'
import { ScooterEntity } from '../connection/postgres/entity/scooter.entity'
import { UserEntity } from '../connection/postgres/entity/user.entity'
import { RedisService } from '../connection/redis/redis.service'
import { CreateOrderDto } from './order.dto'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ScooterEntity)
    private scootersRepository: Repository<ScooterEntity>,
    private readonly redisService: RedisService
  ) {}

  async createOrderService(req: CreateOrderDto.Request): Promise<CreateOrderDto.Response> {
    const user = await this.userRepository.findOne({
      where: { id: req.userID }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const scooter = await this.userRepository.findOne({
      where: { id: req.scooterID }
    })

    if (!scooter) {
      throw new Error('Scooter not found')
    }

    // Lock user and scooter
    const redisClient = this.redisService.getClient()

    const scooterLockKey = `${Define.RedisKey.scooterOccupiedLock}${req.scooterID}`
    const userLockKey = `${Define.RedisKey.userRiddingLock}${req.userID}`

    if ((await redisClient.exists(scooterLockKey)) || (await redisClient.exists(userLockKey))) {
      throw 'Still in lock'
    }

    //TODO: Still might be race condition between two locks. Use LUA for atomic operation
    const scooterLock = await this.redisService.lock(scooterLockKey, Define.Order.defaultReservedTimeout, req.userID)
    const userLock = await this.redisService.lock(userLockKey, null, req.userID)

    if (!scooterLock || !userLock) {
      // Rollback
      await redisClient.del(scooterLockKey)
      await redisClient.del(userLockKey)

      throw 'Cannot lock resource'
    }

    // Create order

    return new CreateOrderDto.Response()
  }
}
