import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDto) {
    const newAddress = this.addressRepository.create({
      ...createAddressDto,
      user_id: userId,
    });
    return this.addressRepository.save(newAddress);
  }

  async findAll(userId: number) {
    return this.addressRepository.find({
      where: { user_id: userId },
    });
  }

  async findOne(userId: number, id: number) {
    const address = await this.addressRepository.findOne({
      where: { user_address_id: id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

 
    if (address.user_id !== userId) {
      throw new UnauthorizedException('You are not authorized to access this address');
    }

    return address;
  }

  async remove(userId: number, id: number) {
    const address = await this.findOne(userId, id); 
    await this.addressRepository.delete(id);
    return { deleted: true };
  }
}