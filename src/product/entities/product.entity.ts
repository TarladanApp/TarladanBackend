import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_table')
export class Product{

    @PrimaryGeneratedColumn()
    product_id:number;

    @Column()
    farmer_id:number;

    @Column()
    product_katalog_name:string;

    @Column()
    product_name:string;

    @Column({type: 'float'})
    farmer_price:number;

    @Column({type: 'float'})
    tarladan_commission:number;

    @Column({type: 'float'})
    tarladan_price:number;

    @Column()
    stock_quantity:number;

    @Column({type: 'float' , nullable:true})
    product_rating:number;

}