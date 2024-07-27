import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { isTestMode } from '../../util'
import { RentEntity } from './entity/rent.entity'
import { ScooterEntity } from './entity/scooter.entity'
import { UserEntity } from './entity/user.entity'

const entityList = [UserEntity, ScooterEntity, RentEntity]

@Module({
  imports: [
    isTestMode()
      ? TypeOrmModule.forRootAsync({
          imports: [],
          useFactory: () => ({
            name: 'test1234',
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            logging: process.argv.includes('--sql-log') ? true : ['error'],
            autoLoadEntities: true,
            entities: entityList
          })
        })
      : TypeOrmModule.forRootAsync({
          imports: [],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: entityList
            // synchronize: configService.get('MODE') !== 'production',
          }),
          inject: [ConfigService]
        }),
    TypeOrmModule.forFeature(entityList)
  ],
  exports: [TypeOrmModule.forFeature(entityList)]
})
export class PostgresModule {}
