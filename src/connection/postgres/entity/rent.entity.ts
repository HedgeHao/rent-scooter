import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Define } from '../../../define'
import { unixTime } from '../../../util'
import { ScooterEntity } from './scooter.entity'
import { UserEntity } from './user.entity'

@Entity('rent')
export class RentEntity {
  constructor(fields?: Partial<RentEntity>) {
    Object.assign(this, fields)
  }

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => UserEntity, (user) => user.rent)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity

  @ManyToOne(() => ScooterEntity, (scooter) => scooter.rents)
  @JoinColumn({ name: 'scooter_id' })
  scooter!: ScooterEntity

  @Column({ name: 'reservation_time', type: 'int' })
  reservationTime!: number

  @Column({ name: 'start_time', type: 'int', nullable: true })
  startTime!: number

  @Column({ name: 'end_time', type: 'int', nullable: true })
  endTime!: number

  @Column({ type: 'int' })
  status!: Define.Rent.Status.Type

  @BeforeInsert()
  beforeInsert() {
    this.reservationTime = unixTime()
  }
}
