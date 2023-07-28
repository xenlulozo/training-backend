import { Entity, Column, PrimaryGeneratedColumn, IntegerType, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Oauth } from '../../oauth/entities/oauth.entity';

@Entity()
export class User {

    // @Column()
    // id: number;

    @PrimaryGeneratedColumn({ type: 'bigint' })
    user_id: number;

    // @OneToMany(() => Oauth, oauth => oauth.id)
    // oauth: Oauth[];

    @Column({
        nullable: true,
        default: ''
    })
    avatar: string;

    @Column({
        nullable: true,
        default: ''
    })
    street: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column()
    password: string;

    @Column({
        nullable: true,
        default: ''
    })
    lat: string;

    @Column({
        nullable: true,
        default: ''
    })
    lng: string;

    @Column({
        nullable: true,
        default: 0
    })
    country_id: number;

    @Column({
        nullable: true,
        default: 0
    })
    city_id: number;

    @Column({
        nullable: true,
        default: 0
    })
    district_id: number;

    @Column({
        nullable: true,
        default: 0
    })
    ward_id: number;

    @Column({
        type: 'varchar', nullable: true,
        default: ''
    })
    phone: string;

    @Column({
        type: 'varchar', nullable: true,
        default: ''
    })
    gender: string;

    @Column({
        nullable: true,
        default: ''
    })
    birthday: string;

    @CreateDateColumn({
        nullable: true,

    })
    timestamp: Date;

}


