import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

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

    @Column()
    delivery_date: string;

    @Column()
    use_any_coupon: boolean;

    @Column()
    rate_for_order: number;

    @Column()
    timestamp: Timestamp;
}