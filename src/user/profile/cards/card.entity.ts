import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cards')
export class Card {

    @PrimaryGeneratedColumn()
    card_id: number;

    @Column()
    user_id: number;    

    @Column()
    user_card_name: string;

    @Column()
    user_card_number: string;

    @Column()
    user_card_ending_date: string;

    @Column()
    user_card_code: string;
}