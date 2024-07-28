import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { deepStrictEqual, strictEqual } from 'assert'
import { Connection, Repository } from 'typeorm'
import { KafkaModule } from '../connection/kafka/kafka.module'
import { RentEntity } from '../connection/postgres/entity/rent.entity'
import { ScooterEntity } from '../connection/postgres/entity/scooter.entity'
import { UserEntity } from '../connection/postgres/entity/user.entity'
import { PostgresModule } from '../connection/postgres/postgres.module'
import { RedisModule } from '../connection/redis/redis.module'
import { RedisService } from '../connection/redis/redis.service'
import { Define } from '../define'
import { sleep } from '../util'
import { RentService } from './rent.service'

context(__filename, () => {
  let app: INestApplication
  let testModule: TestingModule
  let db: Connection
  let userRepository: Repository<UserEntity>
  let scootersRepository: Repository<ScooterEntity>
  let rentRepository: Repository<RentEntity>
  let service: RentService
  let redisService: RedisService

  let userJosh: UserEntity, userMandy: UserEntity
  let scooterA: ScooterEntity, scooterB: ScooterEntity, scooterC: ScooterEntity

  before(async () => {
    testModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env/dev.env' }), PostgresModule, RedisModule, KafkaModule],
      providers: [RentService]
    }).compile()

    db = testModule.get(Connection)
    userRepository = db.getRepository(UserEntity)
    scootersRepository = db.getRepository(ScooterEntity)
    rentRepository = db.getRepository(RentEntity)

    service = testModule.get(RentService)
    redisService = testModule.get(RedisService)
  })

  it('init db', async () => {
    userJosh = await userRepository.save(new UserEntity({ name: 'Josh', username: 'josh', password: '1234', status: 0 }))
    userMandy = await userRepository.save(new UserEntity({ name: 'Mandy', username: 'mandy', password: '1234', status: 0 }))

    scooterA = await scootersRepository.save(new ScooterEntity({ name: 'scooter A', power: 100.0, status: Define.Scooter.Status.available }))
    scooterB = await scootersRepository.save(new ScooterEntity({ name: 'scooter B', power: 88.8, status: Define.Scooter.Status.available }))
    scooterC = await scootersRepository.save(new ScooterEntity({ name: 'scooter C', power: 66.6, status: Define.Scooter.Status.available }))
  })

  it('Success Flow', async () => {
    let rent = await service.reserve({ userID: userJosh.id, scooterID: scooterA.id })
    strictEqual(rent.status, Define.Rent.Status.reserved)

    rent = await service.startRent({ rentID: rent.id })
    strictEqual(rent.status, Define.Rent.Status.active)

    rent = await service.rentFinish({ rentID: rent.id })
    strictEqual(rent.status, Define.Rent.Status.completed)
  })

  it('Test reservation expired', async () => {
    const redis = redisService.getClient()

    let rent = await service.reserve({ userID: userJosh.id, scooterID: scooterA.id })
    strictEqual(rent.status, Define.Rent.Status.reserved)

    await sleep(1500)
    deepStrictEqual(await redis.get('reservation_2'), null)

    // iosredis-mock do not have event listener. So, call cancel manually
    await service.cancelReservation({ rentID: rent.id })

    strictEqual(await redis.dbsize(), 0)
  }).timeout(5000)
})
