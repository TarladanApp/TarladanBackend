import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './entities/farmer.entity';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer])],
  providers: [FarmerService],
  controllers: [FarmerController],
})
export class FarmerModule {}
