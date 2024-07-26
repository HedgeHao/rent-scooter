import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ScooterEntity } from './scooter.entity';
import { Define } from 'src/define';

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.order)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => ScooterEntity, scooter => scooter.rents)
    @JoinColumn()
    scooter: ScooterEntity;

    @Column({ type: 'timestamp' })
    reservationTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ type: 'int', })
    status: Define.OrderStatus.Type;
}