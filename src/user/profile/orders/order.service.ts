import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ){}   

  async findAll(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      order: { order_date: 'DESC' }, 
      relations: ['orderProducts'],
    });
    return orders;
  }

  async findOne(userId: number, id: number) {
    const order = await this.orderRepository.findOne({
      where: {order_id: id },
      relations: ['orderProducts'],
    });
    
    if(!order){
        throw new NotFoundException(`Order with id ${id} not found`);
    }

    if(order.user_id !== userId){
        throw new UnauthorizedException(`You are not authorized to access this order`);
    }

    return order;
  }
}