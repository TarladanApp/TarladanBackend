import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @Column()
    user_id: number;

    @Column({ nullable: true })
    delivery_address_id: number;

    @Column()
    order_date: string;

    @Column({ nullable: true })
    estimated_delivery_date: string;

    @Column()
    order_status: string;

    @Column({ nullable: true })
    delivery_date: string;

    @Column({default: false})
    use_any_coupon: boolean;

    @Column({ nullable: true })
    rate_for_order: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
    orderProducts: OrderProduct[]; 

}
