import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Address } from './addresses/address.entity';
import { Card } from './cards/card.entity';
import { Order } from './orders/entities/order.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user.module';
import { AddressController } from './addresses/address.controller';
import { AddressService } from './addresses/address.service';
import { CardController } from './cards/card.controller';
import { CardService } from './cards/card.service';
import { OrderController } from './orders/order.controller';
import { OrderService } from './orders/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Card, Order]),
    UserModule,
  ],
  controllers: [ProfileController,AddressController,CardController,OrderController],
  providers: [ProfileService,AddressService,CardService,OrderService],
})
export class ProfileModule {}