import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../entities/user.entity";

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

    @Column({ name: 'is_default', type: 'boolean', default: false })
    isDefault: boolean;

    @ManyToOne(() => User, (user) => user.addresses)
    user: User;

}