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
import { ScooterController } from './scooter/scooter.controller'
import { ScooterService } from './scooter/scooter.service'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'
import { isDeploy } from './util'

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
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: isDeploy() ? '/etc/deploy.env' : 'env/dev.env' }),
    PostgresModule,
    RedisModule,
    KafkaModule
  ],
  controllers: [AppController, UserController, RentController, ScooterController],
  providers: [apiValidationPipe, AppService, UserService, RentService, ScooterService]
})
export class AppModule {}
