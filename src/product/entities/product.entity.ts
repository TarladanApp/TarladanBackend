import { UUID } from "crypto";
import { Farmer } from "src/farmer/entities/farmer.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false})
    farmer_id:number;

    @Column()
    product_katalog_name:string;

    @Column({nullable:false})
    product_name:string;

    @Column({type: 'float'})
    farmer_price:number;

    @Column({type: 'float'})
    tarladan_commission:number;

    @Column({type: 'float'})
    tarladan_price:number;

    @Column({nullable:false})
    stock_quantity:number;

    @Column({nullable:true})
    image_url:string;

    @Column({nullable:true})
    created_at:Date;

    @Column({nullable:true})
    updated_at:Date;

    @ManyToOne(() => Farmer, (farmer) => farmer.products)
    @JoinColumn({ name: 'farmer_id' ,referencedColumnName: 'farmer_id'})
    farmer: Farmer;

}