import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friend {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({

        default: 0
    })
    user_1: number;

    @Column({

        default: 0
    })
    user_2: number;

    @Column({

        default: 0
    })
    type: number;


}