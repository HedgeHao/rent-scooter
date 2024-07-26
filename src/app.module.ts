import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './connection/postgres/postgres.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env/dev.env' }),
    PostgresModule,
  ],
  controllers: [AppController, UserController, OrderController],
  providers: [AppService, UserService, OrderService],
})
export class AppModule { }
