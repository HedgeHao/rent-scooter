import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './entity/user.entity';
import { ScooterEntity } from './entity/scooter.entity';
import { OrderEntity } from './entity/order.entity';

const entityList = [
    UserEntity,
    ScooterEntity,
    OrderEntity
]

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: +configService.get<number>('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: entityList,
                // synchronize: configService.get('MODE') !== 'production',
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(entityList)
    ],
    exports: [
        TypeOrmModule.forFeature(entityList)
    ]
})
export class PostgresModule { }