import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryColumn({ type: 'int' })
    id!: number

    @Column('varchar', { nullable: false })
    name!: string

    @Column('int', { nullable: true })
    age!: number | null

    @Column('decimal', { nullable: true })
    height!: number | null

    @Column('varchar', { nullable: false })
    username!: string

    @Column('varchar', { nullable: false })
    password!: string
}