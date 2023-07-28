import { Entity, Column, PrimaryGeneratedColumn, IntegerType, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Message } from '../../message/entities/message.entity';

@Entity()
export class Conversation {



    @PrimaryGeneratedColumn()
    conversation_id: number;

    // @OneToMany(() => Message, message => message.conversation)
    // message: Message[];


    @Column({
        nullable: true,
        default: ''
    })
    name: string;

    @Column({
        nullable: true,
        default: ''
    })
    avatar: string;

    @Column({ nullable: true, type: 'bigint' })
    last_message_id: number;

    @Column({
        nullable: true,
        default: 0
    })
    type: number;

    @Column("int", { nullable: true, array: true })
    member: number[];

    @Column({
        nullable: true,
        default: ''
    })
    background: string;

    @CreateDateColumn({
        nullable: true,
    })
    last_activity: Date;

    @Column({
        nullable: true,
        default: 0
    })
    status: number;

    @CreateDateColumn({
        nullable: true,
    })
    timestamp: Date;

}