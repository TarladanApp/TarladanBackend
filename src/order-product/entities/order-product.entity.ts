import { Order } from "src/user/profile/orders/order.entity";
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
    unit_quantity: number;

    @Column()
    unit_price: number;

    @Column()
    total_product_price: number;

    @Column()
    order_product_rate: string;

    @Column()
    farmer_id: number;

    @Column()
    farmer_name: string;

    @ManyToOne(() => Order, (order) => order.orderProducts)
    @JoinColumn({ name: 'order_id' })
    order: Order;

}