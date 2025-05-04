import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from './addresses/address.entity';
import { Card } from './cards/card.entity';
import { Order } from './orders/entities/order.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ 
      where: { user_id: userId },
      select: ['user_id', 'user_mail', 'user_name', 'user_surname', 'user_phone_number', 'user_birthday_date'] 
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    
    const addresses = await this.addressRepository.find({
      where: { user_id: userId },
    });


    const cards = await this.cardRepository.find({
      where: { user_id: userId },
    });

   
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      order: { order_date: 'DESC' }, 
    });

    
    return {
      user,
      addresses,
      cards,
      orders,
    };
  }
}