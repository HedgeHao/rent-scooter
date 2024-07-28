import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Define } from '../../../define'
import { RentEntity } from './rent.entity'

@Entity('user')
export class UserEntity {
  constructor(fields?: Partial<UserEntity>) {
    Object.assign(this, fields)
  }

  @PrimaryColumn({ type: 'int' })
  id!: number

  @Column('varchar')
  name!: string

  @Column('varchar', { nullable: false })
  username!: string

  @Column('int')
  status!: Define.User.Status.Type

  @Column('varchar')
  password!: string

  @OneToMany(() => RentEntity, (rent) => rent.user)
  rent: RentEntity[]
}
