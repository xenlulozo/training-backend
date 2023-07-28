import { Entity, Column, PrimaryGeneratedColumn, IntegerType, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Oauth {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('bigint')
    user_id: number;

    @OneToOne(() => User, user => user.user_id)
    @JoinColumn({ name: "user_id" })
    user: User[];

    @Column()
    access_token: string;

    @Column({
        nullable: true,
    })
    status: number;

    @CreateDateColumn({
        nullable: true,
    })
    timestamp: Date;

}


