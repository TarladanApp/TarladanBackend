import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Address } from './addresses/address.entity';
import { Card } from './cards/card.entity';
import { Order } from './orders/order.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user.module';
import { AddressController } from './addresses/address.controller';
import { AddressService } from './addresses/address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Card, Order]),
    UserModule,
  ],
  controllers: [ProfileController,AddressController],
  providers: [ProfileService,AddressService],
})
export class ProfileModule {}