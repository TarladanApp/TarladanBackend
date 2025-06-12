import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderProduct } from "./entities/order-product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Order } from "../user/profile/orders/entities/order.entity";
import { Product } from "../product/entities/product.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { create } from "domain";
import { Address } from "../user/profile/addresses/address.entity";
import { privateDecrypt } from "crypto";

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
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
    ){}



    async createOrder(userId:number,createOrderDto: CreateOrderDto){
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const address = await this.addressRepository.findOne({
              where: { user_address_id: createOrderDto.delivery_address_id, user_id: userId }
            });
        
            if (!address) {
              throw new NotFoundException(`Address with ID ${createOrderDto.delivery_address_id} not found`);
            }

            const newOrder = this.orderRepository.create({
                user_id: userId,
                order_status: 'pending',
                order_date: new Date().toISOString(),
                delivery_address_id : createOrderDto.delivery_address_id,
                estimated_delivery_date: this.calculateEstimatedDeliveryDate(),
                use_any_coupon: createOrderDto.use_any_coupon ?? false,
                address_full: address.full_address,
                address_city: address.city,
                address_district: address.district,
                address_neighborhood: address.neighborhood,
                address_street: address.street,
                address_floor: address.floor,
                address_apartment: address.apartment
            });

            const savedOrder = await queryRunner.manager.save(newOrder);

            for (const item of createOrderDto.products) {
                const product = await this.productRepository.findOne({
                  where: { id: item.product_id }
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
                  product_id: product.id,
                  product_name: product.product_name,
                  unit_quantity: item.unit_quantity,
                  unit_price: product.tarladan_price,
                  total_product_price: product.tarladan_price * item.unit_quantity,
                  farmer_id: product.farmer_id,
                  farmer_name: 'Farmer servisinden çekilecek', 
                  delivery_address_id: createOrderDto.delivery_address_id,
                });
        
                await queryRunner.manager.save(orderProduct);
              }
        
              
              await queryRunner.commitTransaction();
        
              return this.orderRepository.findOne({
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
