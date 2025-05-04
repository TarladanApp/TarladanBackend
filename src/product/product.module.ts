import { Module } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { Order } from "src/user/profile/orders/entities/order.entity";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product,Order,OrderProduct])
    ],
    controllers: [ProductController],
    providers: [ProductService]
 })


 export class ProductModule {};
