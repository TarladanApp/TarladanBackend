import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OrderProduct } from './order-product/entities/order-product.entity';
import { OrderProductModule } from './order-product/order-product.module';
import { ProductModule } from './product/product.module';
import { Order } from './user/profile/orders/entities/order.entity';
import { ProfileModule } from './user/profile/profile.module';
import { UserModule } from './user/user.module';
import { PerformanceModule } from './performance/performance.module';
import { FarmerModule } from './farmer/farmer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      entities: [Order, OrderProduct]
    }),
    FarmerModule,
    UserModule,
    AuthModule,
    ProfileModule,
    OrderProductModule,
    ProductModule,
    PerformanceModule,
  ],
})
export class AppModule {}
