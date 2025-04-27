import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('delivery_address')
export class Address {

    @PrimaryGeneratedColumn()
    user_address_id: number;

    @Column()
    user_id: number; 

    @Column()
    full_address: string;

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