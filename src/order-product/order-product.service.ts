import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderProduct } from "./entities/order-product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Order } from "src/user/profile/orders/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { create } from "domain";

@Injectable()
export class OrderProductService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(OrderProduct)
        private orderProductRepository: Repository<OrderProduct>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ){}



    async createOrder(userId:number,createOrderDto: CreateOrderDto){
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const newOrder = this.orderRepository.create({
                user_id: userId,
                order_status: 'pending',
                order_date: new Date().toISOString(),
                estimated_delivery_date: this.calculateEstimatedDeliveryDate(),
                use_any_coupon: createOrderDto.use_any_coupon ?? false,
            });

            const savedOrder = await queryRunner.manager.save(newOrder);

            for (const item of createOrderDto.products) {
                const product = await this.productRepository.findOne({
                  where: { product_id: item.product_id }
                });
        
                if (!product) {
                  throw new NotFoundException(`Product with ID ${item.product_id} not found`);
                }
        
                if (product.stock_quantity < item.unit_quantity) {
                  throw new BadRequestException(`Not enough stock for product ${product.product_name}`);
                }
        
            
                product.stock_quantity -= item.unit_quantity;
                await queryRunner.manager.save(product);
        
               
                const orderProduct = this.orderProductRepository.create({
                  order_id: savedOrder.order_id,
                  product_id: product.product_id,
                  unit_quantity: item.unit_quantity,
                  unit_price: product.tarladan_price,
                  total_product_price: product.tarladan_price * item.unit_quantity,
                  farmer_id: product.farmer_id,
                  farmer_name: 'Farmer servisinden çekilecek', 
                });
        
                await queryRunner.manager.save(orderProduct);
              }
        
              
              await queryRunner.commitTransaction();
        
              return this.orderRepository.findOne({
                where: { order_id: savedOrder.order_id },
                relations: ['orderProducts'],
              });
            } catch (error) {
              
              await queryRunner.rollbackTransaction();
              throw error;
            } finally {
              
              await queryRunner.release();
            }

        
    }



    private calculateEstimatedDeliveryDate(): string {
        const date = new Date();
        date.setDate(date.getDate() + 1); 
        return date.toISOString();
    }
}
