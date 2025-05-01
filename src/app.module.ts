import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OrderProduct } from './order-product/entities/order-product.entity';
import { Order } from './user/profile/orders/order.entity';
import { ProfileModule } from './user/profile/profile.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [Order, OrderProduct]
    }),
    UserModule,
    AuthModule,
    ProfileModule
  ],
})
export class AppModule {}
