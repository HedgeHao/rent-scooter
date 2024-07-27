import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Define } from 'src/define'
import { unixTime } from 'src/util'
import { Repository } from 'typeorm'
import { OrderEntity } from '../connection/postgres/entity/order.entity'
import { ScooterEntity } from '../connection/postgres/entity/scooter.entity'
import { UserEntity } from '../connection/postgres/entity/user.entity'
import { RedisService } from '../connection/redis/redis.service'
import { CreateOrderDto, StartRentDto } from './order.dto'

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

    const scooter = await this.scootersRepository.findOne({
      where: { id: req.scooterID }
    })

    if (!scooter) {
      throw new Error('Scooter not found')
    }

    // Lock user and scooter
    const redisClient = this.redisService.getClient()

    const scooterLockKey = Define.RedisKey.scooterOccupiedLock(req.scooterID)
    const userLockKey = Define.RedisKey.userReservingLock(req.userID)

    //TODO: Still might be race condition between two locks. Use LUA for atomic operation
    const scooterLock = await this.redisService.lock(scooterLockKey, 0, req.userID)
    const userLock = await this.redisService.lock(userLockKey, 0, req.userID)

    if (!scooterLock || !userLock) {
      throw Error('Cannot lock resource')
    }

    // Create order
    const order = await this.orderRepository.save(
      new OrderEntity({
        scooter: scooter,
        user: user,
        status: Define.OrderStatus.reserved
      })
    )

    const reservationKey = Define.RedisKey.reservationLock(order.id)
    await redisClient.hset(reservationKey, <Define.RedisKey.reservationHash>{
      userID: order.user.id,
      scooterID: order.scooter.id
    })
    await redisClient.expire(reservationKey, Define.Order.defaultReservedTimeout)

    return order
  }

  async reservationExpired(orderID: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderID } })

    const redisClient = this.redisService.getClient()
    const scooterLockKey = Define.RedisKey.scooterOccupiedLock(order.scooter.id)
    const userLockKey = Define.RedisKey.userReservingLock(order.user.id)
    await redisClient.del(scooterLockKey)
    await redisClient.del(userLockKey)

    order.status = Define.OrderStatus.expired
    await this.orderRepository.save(order)
  }

  async startRent(req: StartRentDto.Request): Promise<StartRentDto.Response> {
    let order = await this.orderRepository.findOne({ where: { id: req.orderID } })

    if (!order) {
      throw Error('Not Found')
    }

    const redisClient = this.redisService.getClient()
    const reservationKey = Define.RedisKey.reservationLock(order.id)

    if (!(await redisClient.exists(reservationKey))) {
      order.status = Define.OrderStatus.error
      await this.orderRepository.save(order)
      throw new Error('Cannot acquire locks')
    }

    await redisClient.del(reservationKey)

    order.startTime = unixTime()
    order.status = Define.OrderStatus.active
    order = await this.orderRepository.save(order)

    console.log(order)

    return order
  }
}
