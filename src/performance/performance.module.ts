import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { ProductController } from 'src/product/product.controller';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { FarmerModule } from 'src/farmer/farmer.module';
import { FarmerService } from 'src/farmer/farmer.service';
import { FarmerController } from 'src/farmer/farmer.controller';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, Farmer]),
    ProductModule,
    UserModule,
    FarmerModule
  ],
  controllers: [ProductController, PerformanceController, FarmerController],
  providers: [ProductService, PerformanceService, FarmerService],
})
export class PerformanceModule {}