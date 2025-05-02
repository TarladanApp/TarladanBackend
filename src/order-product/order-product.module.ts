import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderProduct } from "./entities/order-product.entity";
import { Order } from "src/user/profile/orders/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { OrderProductService } from "./order-product.service";
import { OrderProductController } from "./order-product.controller";
import { Address } from "src/user/profile/addresses/address.entity";

@Module({
    imports: [TypeOrmModule.forFeature([OrderProduct, Order, Product,Address])],
    controllers: [OrderProductController],
    providers: [OrderProductService],
  })
  export class OrderProductModule {}