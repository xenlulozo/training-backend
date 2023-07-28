import { Entity, Column, PrimaryGeneratedColumn, IntegerType, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';



@Entity()
export class SocketDb {

    @PrimaryGeneratedColumn()
    socket_id: number;

    @Column({
        nullable: true,
        default: ''
    })
    user_id: string;

    @Column({
        nullable: true,
        default: ''
    })
    socket: string;

}