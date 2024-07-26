import { Define } from 'src/define'
import { unixTime } from 'src/util'
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ScooterEntity } from './scooter.entity'
import { UserEntity } from './user.entity'

@Entity('order')
export class OrderEntity {
  constructor(fields?: Partial<OrderEntity> & Pick<OrderEntity, 'scooter' | 'user' | 'status'>) {
    Object.assign(this, fields)
  }

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => UserEntity, (user) => user.order)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity

  @ManyToOne(() => ScooterEntity, (scooter) => scooter.orders)
  @JoinColumn({ name: 'scooter_id' })
  scooter!: ScooterEntity

  @Column({ name: 'reservation_time', type: 'int' })
  reservationTime!: number

  @Column({ name: 'start_time', type: 'int', nullable: true })
  startTime!: number

  @Column({ name: 'end_time', type: 'int', nullable: true })
  endTime!: number

  @Column({ type: 'int' })
  status!: Define.OrderStatus.Type

  @BeforeInsert()
  beforeInsert() {
    this.reservationTime = unixTime()
  }
}
