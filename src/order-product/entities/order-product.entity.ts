import { Order } from "../../user/profile/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_product')
export class OrderProduct {
    @PrimaryGeneratedColumn()
    order_product_id: number;

    @Column()
    order_id: number;

    @Column()
    product_id: number;

    @Column()
    product_name:string

    @Column()
    unit_quantity: number;

    @Column()
    unit_price: number;

    @Column()
    total_product_price: number;

    @Column({nullable :true})
    order_product_rate: string;

    @Column()
    farmer_id: number;

    @Column()
    farmer_name: string;

    @Column({nullable:false})
    delivery_address_id: number;

    @ManyToOne(() => Order, (order) => order.orderProducts)
    @JoinColumn({ name: 'order_id' })
    order: Order;

}