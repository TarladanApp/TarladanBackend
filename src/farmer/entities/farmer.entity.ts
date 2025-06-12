import { Product } from "src/product/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('farmer')
export class Farmer {

    @PrimaryGeneratedColumn()
    farmer_id: number;

    @Column({nullable:false})
    farmer_password: string;

    @Column({nullable:false})
    farmer_name:string;

    @Column({nullable:false})
    farmer_last_name:string;

    @Column({nullable:false})
    farmer_age:number;

    @Column({nullable:false})
    farmer_address:string;

    @Column({nullable:false})
    farmer_city:string;

    @Column({nullable:false})
    farmer_town:string;

    @Column({nullable:false})
    farmer_neighbourhood:string;

    @Column({nullable:false})
    farmer_phone_number:string;

    @Column({nullable:false})
    farmer_mail:string;

    @Column({nullable:true})
    farmer_activity_status: string;

    @Column({nullable:false})
    farm_name:string;

    @Column({nullable:true})
    farmer_tc_no:string;

    @Column({nullable:true})
    img_url:string;

    @Column({nullable:true})
    farmer_biografi:string;

    @OneToMany(() => Product, (product) => product.farmer)
    products: Product[];
}