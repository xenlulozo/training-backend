import { Entity, Column, PrimaryGeneratedColumn, IntegerType, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Message {


    @PrimaryGeneratedColumn({ type: 'bigint' })
    message_id: number;

    @Column()
    conversation_id: number;

    @ManyToOne(() => Conversation, conversation => conversation.conversation_id)
    @JoinColumn({ name: "conversation_id" })
    conversation: Conversation[];

    @ManyToOne(() => User, user => user.user_id)
    @JoinColumn({ name: "user_id" })
    user: User[];

    @Column({ nullable: true, type: 'bigint' })
    user_id: number;

    @Column({
        nullable: true,
        default: 0

    })
    type: number;


    @Column({ nullable: true, type: 'bigint', default: 0 })
    last_message_id: string;

    @Column({
        nullable: true,
        default: ""
    })
    message: string;

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


