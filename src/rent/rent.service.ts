import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { KafkaService } from '../connection/kafka/kafka.service'
import { RentEntity } from '../connection/postgres/entity/rent.entity'
import { ScooterEntity } from '../connection/postgres/entity/scooter.entity'
import { UserEntity } from '../connection/postgres/entity/user.entity'
import { RedisService } from '../connection/redis/redis.service'
import { Define } from '../define'
import { unixTime } from '../util'
import { CancelRentDto, CreateRentDto, FinishRentDto as RentFinishDto, StartRentDto, rentEntity2Info } from './rent.dto'

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(RentEntity)
    private rentRepository: Repository<RentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ScooterEntity)
    private scootersRepository: Repository<ScooterEntity>,
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService
  ) {
    const subscriber = this.redisService.getSubscriber()
    subscriber.subscribe('__keyevent@0__:expired', (err, count) => {
      if (err) {
        console.error('Cannot subscribe', err)
      } else {
        subscriber.on('message', (channel: string, message: string) => {
          const match = message.match(/_(\d+)$/)
          if (match) {
            console.log(match)
            const rentID = parseInt(match[1], 10)
            this.reservationExpired(rentID)
          }
        })
      }
    })
  }

  async reserve(req: CreateRentDto.Request): Promise<CreateRentDto.Response> {
    const user = await this.userRepository.findOne({
      where: { id: req.userID }
    })

    if (!user) {
      throw new Error('User not found')
    } else if (user.status !== Define.User.Status.free) {
      throw new Error('User is not available')
    }

    const scooter = await this.scootersRepository.findOne({
      where: { id: req.scooterID }
    })

    if (!scooter) {
      throw new Error('Scooter not found')
    } else if (scooter.status !== Define.Scooter.Status.available) {
      throw new Error('Scooter is not available')
    }

    // Lock user and scooter
    const redisClient = this.redisService.getClient()

    const scooterLockKey = Define.RedisKey.scooterOccupiedLock(scooter.id)
    const userLockKey = Define.RedisKey.userReservingLock(user.id)

    //TODO: Still might be race condition between two locks. Use LUA for atomic operation
    const scooterLock = await this.redisService.lock(scooterLockKey, 0, req.userID)
    if (!scooterLock) {
      throw Error('Scooter is already reserved by others')
    }

    const userLock = await this.redisService.lock(userLockKey, 0, req.userID)
    if (!userLock) {
      await redisClient.del(scooterLockKey)
      throw Error('User already reserve other scooter')
    }

    try {
      // Create reservation
      const rent = await this.rentRepository.save(
        new RentEntity({
          scooter: scooter,
          user: user,
          status: Define.Rent.Status.reserved,
          reservationExpiredAt: unixTime() + Define.Rent.defaultReservedTimeout
        })
      )

      const reservationKey = Define.RedisKey.reservationLock(rent.id)
      await redisClient.hset(reservationKey, <Define.RedisKey.reservationHash>{
        userID: rent.user.id,
        scooterID: rent.scooter.id
      })
      await redisClient.expire(reservationKey, Define.Rent.defaultReservedTimeout)

      scooter.status = Define.Scooter.Status.reserved
      await this.scootersRepository.save(scooter)

      user.status = Define.User.Status.reserved
      await this.userRepository.save(user)

      return rentEntity2Info(rent)
    } catch (e) {
      await redisClient.del(scooterLockKey)
      await redisClient.del(userLockKey)
      throw e
    }
  }

  async reservationExpired(rentID: number): Promise<void> {
    const rent = await this.rentRepository.findOne({ where: { id: rentID }, relations: ['user', 'scooter'] })

    const redisClient = this.redisService.getClient()
    const scooterLockKey = Define.RedisKey.scooterOccupiedLock(rent.scooter.id)
    const userLockKey = Define.RedisKey.userReservingLock(rent.user.id)
    await redisClient.del(scooterLockKey)
    await redisClient.del(userLockKey)

    rent.scooter.status = Define.Scooter.Status.available
    await this.scootersRepository.save(rent.scooter)

    rent.status = Define.Rent.Status.expired
    await this.rentRepository.save(rent)

    rent.user.status = Define.User.Status.free
    await this.userRepository.save(rent.user)
  }

  async startRent(req: StartRentDto.Request): Promise<StartRentDto.Response> {
    let rent = await this.rentRepository.findOne({ where: { id: req.rentID }, relations: ['user', 'scooter'] })

    if (!rent) {
      throw Error('Not Found')
    }

    const redisClient = this.redisService.getClient()
    const reservationKey = Define.RedisKey.reservationLock(rent.id)

    if (rent.status !== Define.Rent.Status.reserved) {
      throw new Error('Rent is already active')
    }

    if (!(await redisClient.exists(reservationKey))) {
      rent.status = Define.Rent.Status.error
      await this.rentRepository.save(rent)
      throw new Error('Cannot acquire locks')
    }

    await redisClient.del(reservationKey)

    rent.startTime = unixTime()
    rent.status = Define.Rent.Status.active
    rent = await this.rentRepository.save(rent)

    rent.scooter.status = Define.Scooter.Status.inUse
    await this.scootersRepository.save(rent.scooter)

    rent.user.status = Define.User.Status.ridding
    await this.userRepository.save(rent.user)

    return rentEntity2Info(rent)
  }

  async cancelReservation(req: CancelRentDto.Request): Promise<CancelRentDto.Response> {
    let rent = await this.rentRepository.findOne({ where: { id: req.rentID }, relations: ['user', 'scooter'] })

    if (rent.status !== Define.Rent.Status.reserved) {
      throw Error('Rent is not reserved')
    }

    const redisClient = this.redisService.getClient()
    const scooterLockKey = Define.RedisKey.scooterOccupiedLock(rent.scooter.id)
    const userLockKey = Define.RedisKey.userReservingLock(rent.user.id)
    await redisClient.del(scooterLockKey)
    await redisClient.del(userLockKey)

    rent.status = Define.Rent.Status.canceled
    rent = await this.rentRepository.save(rent)

    rent.scooter.status = Define.Scooter.Status.available
    await this.scootersRepository.save(rent.scooter)

    rent.user.status = Define.User.Status.free
    await this.userRepository.save(rent.user)

    return rentEntity2Info(rent)
  }

  async rentFinish(req: RentFinishDto.Request): Promise<RentFinishDto.Response> {
    let rent = await this.rentRepository.findOne({ where: { id: req.rentID }, relations: ['user', 'scooter'] })

    if (!rent || rent.status !== Define.Rent.Status.active) {
      throw Error('Rent is not activated')
    }

    const redisClient = this.redisService.getClient()
    const scooterLockKey = Define.RedisKey.scooterOccupiedLock(rent.scooter.id)
    const userLockKey = Define.RedisKey.userReservingLock(rent.user.id)

    await redisClient.del(scooterLockKey)
    await redisClient.del(userLockKey)

    rent.endTime = unixTime()
    rent.status = Define.Rent.Status.completed
    rent = await this.rentRepository.save(rent)

    rent.scooter.status = Define.Scooter.Status.available
    await this.scootersRepository.save(rent.scooter)

    rent.user.status = Define.User.Status.free
    await this.userRepository.save(rent.user)

    await this.kafkaService.produce(Define.Kafka.Topic.rentComplete, {
      rentID: rent.id,
      userID: rent.user.id,
      scooterID: rent.scooter.id,
      startTime: rent.startTime,
      endTime: rent.endTime,
      status: rent.status
    })

    return rentEntity2Info(rent)
  }
}
