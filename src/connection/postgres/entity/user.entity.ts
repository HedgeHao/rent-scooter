import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { OrderEntity } from './order.entity'

@Entity('user')
export class UserEntity {
  constructor(fields?: Partial<UserEntity> & Pick<UserEntity, 'name' | 'age' | 'height' | 'username' | 'password'>) {
    Object.assign(this, fields)
  }

  @PrimaryColumn({ type: 'int' })
  id!: number

  @Column('varchar')
  name!: string

  @Column('int', { nullable: true })
  age!: number | null

  @Column('decimal', { nullable: true })
  height!: number | null

  @Column('varchar', { nullable: false })
  username!: string

  @Column('varchar')
  password!: string

  @OneToMany(() => OrderEntity, (order) => order.user)
  order: OrderEntity[]
}
