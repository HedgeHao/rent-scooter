import { Module, Provider, ValidationPipe, ValidationPipeOptions } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { KafkaModule } from './connection/kafka/kafka.module'
import { PostgresModule } from './connection/postgres/postgres.module'
import { RedisModule } from './connection/redis/redis.module'
import { RentController } from './rent/rent.controller'
import { RentService } from './rent/rent.service'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'

const apiValidationPipe: Provider = {
  provide: APP_PIPE,
  useFactory: () => {
    const options: ValidationPipeOptions = {
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }

    return new ValidationPipe(options)
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env/dev.env' }), PostgresModule, RedisModule, KafkaModule],
  controllers: [AppController, UserController, RentController],
  providers: [apiValidationPipe, AppService, UserService, RentService]
})
export class AppModule {}
