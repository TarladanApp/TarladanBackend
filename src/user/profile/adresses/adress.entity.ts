import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('delivery_address')
export class Adress {

    @PrimaryGeneratedColumn()
    adress_id: number;

    @Column()
    user_id: number; 

    @Column()
    full_adress: string;

    @Column()
    city: string;   

    @Column()
    district: string;
    
    @Column()
    neighborhood: string;

    @Column()
    street: string;

    @Column()
    floor: number;

    @Column()
    apartment: string;

}