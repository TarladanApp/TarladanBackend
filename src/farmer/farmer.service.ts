import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmer } from './entities/farmer.entity';

@Injectable()
export class FarmerService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) {}

  async findAll(): Promise<Farmer[]> {
    return this.farmerRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Farmer> {
    const farmer = await this.farmerRepository.findOne({ where: { farmer_id: id }, relations: ['products'] });
    if (!farmer) {
      throw new NotFoundException(`Farmer with id ${id} not found`);
    }
    return farmer;
  }

  async create(data: Partial<Farmer>): Promise<Farmer> {
    const farmer = this.farmerRepository.create(data);
    return this.farmerRepository.save(farmer);
  }

  async update(id: number, data: Partial<Farmer>): Promise<Farmer> {
    await this.farmerRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.farmerRepository.delete(id);
  }
}
