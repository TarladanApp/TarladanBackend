import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, ColumnTypeUndefinedError, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @Column()
    user_id: number;

    @Column()
    order_date: string;

    @Column()
    estimated_delivery_date: string;

    @Column()
    order_status: string;

    @Column({nullable:true})
    delivery_date: string;

    @Column({default: false})
    use_any_coupon?: boolean;

    @Column({nullable:true, type: 'float'})
    rate_for_order: number;

    @Column({nullable:false})
    delivery_address_id: number;

    @Column({nullable:true})
    address_full:string;

    @Column({nullable:true})
    address_city: string;
    
    @Column({nullable:true})
    address_district: string;
    
    @Column({nullable:true})
    address_neighborhood: string;
    
    @Column({nullable:true})
    address_street: string;
    
    @Column({nullable:true})
    address_floor: number;
    
    @Column({nullable:true})
    address_apartment: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
    orderProducts: OrderProduct[]; 

}
