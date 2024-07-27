import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { KafkaModule } from './connection/kafka/kafka.module'
import { PostgresModule } from './connection/postgres/postgres.module'
import { RedisModule } from './connection/redis/redis.module'
import { OrderController } from './order/order.controller'
import { OrderService } from './order/order.service'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env/dev.env' }), PostgresModule, RedisModule, KafkaModule],
  controllers: [AppController, UserController, OrderController],
  providers: [AppService, UserService, OrderService]
})
export class AppModule {}
