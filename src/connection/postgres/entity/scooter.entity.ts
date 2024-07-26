import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderEntity } from './order.entity';
import { Define } from '../../../define';

@Entity('scooter')
export class ScooterEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: false, default: 0 })
    status: Define.ScooterStatus.Type;

    @OneToMany(() => OrderEntity, order => order.scooter)
    rents: OrderEntity[];
}