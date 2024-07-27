import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Define } from '../../../define'
import { RentEntity } from './rent.entity'

@Entity('scooter')
export class ScooterEntity {
  constructor(fields?: Partial<ScooterEntity>) {
    Object.assign(this, fields)
  }
  @PrimaryGeneratedColumn()
  id!: number

  @Column('varchar')
  name!: string

  @Column('decimal', { default: 0.0 })
  power!: number

  @Column('int', { nullable: false, default: 0 })
  status!: Define.ScooterStatus.Type

  @OneToMany(() => RentEntity, (rent) => rent.scooter)
  rents: RentEntity[]
}
