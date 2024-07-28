import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { deepStrictEqual, strictEqual } from 'assert'
import * as request from 'supertest'
import { Connection, Repository } from 'typeorm'
import { UserEntity } from '../connection/postgres/entity/user.entity'
import { PostgresModule } from '../connection/postgres/postgres.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

context(__filename, () => {
  let app: INestApplication
  let testModule: TestingModule
  let db: Connection
  let userRepository: Repository<UserEntity>

  before(async () => {
    testModule = await Test.createTestingModule({
      imports: [PostgresModule],
      controllers: [UserController],
      providers: [UserService]
    }).compile()

    app = testModule.createNestApplication()
    await app.init()
    db = testModule.get(Connection)
    userRepository = db.getRepository(UserEntity)
  })

  it('init db', async () => {
    await userRepository.save(new UserEntity({ name: 'Josh', username: 'josh', password: '1234', status: 0 }))
    await userRepository.save(new UserEntity({ name: 'Mandy', username: 'mandy', password: '1234', status: 0 }))
  })

  it('Get all users', async () => {
    const resp = await request(app.getHttpServer()).get('/user').send()

    strictEqual(resp.status, 200)
    deepStrictEqual(resp.body, {
      info: '',
      code: 200,
      detail: [
        { id: 1, name: 'Josh', status: 0 },
        { id: 2, name: 'Mandy', status: 0 }
      ]
    })
  })
})
