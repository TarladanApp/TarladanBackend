import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => User, (user) => user.addresses)
    user: User;

}