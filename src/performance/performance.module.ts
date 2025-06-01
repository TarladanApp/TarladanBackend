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

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,User]),
    ProductModule,
    UserModule
  ],
  controllers: [ProductController,PerformanceController],
  providers: [ProductService,PerformanceService],
})
export class PerformanceModule{}