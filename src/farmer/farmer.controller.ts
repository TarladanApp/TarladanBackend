import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { Farmer } from './entities/farmer.entity';

@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get()
  findAll(): Promise<Farmer[]> {
    return this.farmerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Farmer> {
    return this.farmerService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: Partial<Farmer>): Promise<Farmer> {
    return this.farmerService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Farmer>): Promise<Farmer> {
    return this.farmerService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.farmerService.remove(Number(id));
  }
}
