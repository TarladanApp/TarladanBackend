import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductService } from './order-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Order } from '../user/profile/orders/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Address } from '../user/profile/addresses/address.entity';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderProductRepository: Repository<OrderProduct>;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;
  let addressRepository: Repository<Address>;
  let dataSource: DataSource;

  const mockAddress = {
    user_address_id: 1,
    user_id: 1,
    full_address: 'Test Address',
    city: 'Test City',
    district: 'Test District',
    neighborhood: 'Test Neighborhood',
    street: 'Test Street',
    floor: 1,
    apartment: 'Test Apartment'
  };

  const mockProduct = {
    product_id: 'c10a95f0-f93b-4c80-bd89-c86c3fd18fc3',
    product_name: 'Test Product',
    stock_quantity: 10,
    tarladan_price: 100,
    farmer_id: 1
  };

  const mockOrder = {
    order_id: 1,
    user_id: 1,
    order_status: 'pending',
    order_date: new Date().toISOString(),
    delivery_address_id: 1,
    estimated_delivery_date: new Date().toISOString(),
    use_any_coupon: false,
    address_full: 'Test Address',
    address_city: 'Test City',
    address_district: 'Test District',
    address_neighborhood: 'Test Neighborhood',
    address_street: 'Test Street',
    address_floor: 1,
    address_apartment: 'Test Apartment',
    orderProducts: []
  };

  const mockOrderProduct = {
    order_id: 1,
    product_id: 'c10a95f0-f93b-4c80-bd89-c86c3fd18fc3',
    product_name: 'Test Product',
    unit_quantity: 2,
    unit_price: 100,
    total_product_price: 200,
    farmer_id: 1,
    farmer_name: 'Test Farmer',
    delivery_address_id: 1
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProduct),
          useValue: {
            create: jest.fn().mockReturnValue(mockOrderProduct),
            findOne: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn().mockReturnValue(mockOrder),
            findOne: jest.fn().mockResolvedValue(mockOrder),
            save: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockProduct),
            save: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Address),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockAddress)
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
          }
        }
      ]
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    orderProductRepository = module.get<Repository<OrderProduct>>(getRepositoryToken(OrderProduct));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    addressRepository = module.get<Repository<Address>>(getRepositoryToken(Address));
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    const createOrderDto = {
      delivery_address_id: 1,
      use_any_coupon: false,
      products: [
        {
          product_id: 'c10a95f0-f93b-4c80-bd89-c86c3fd18fc3',
          unit_quantity: 2
        }
      ]
    };

    it('should create an order successfully', async () => {
      const result = await service.createOrder(1, createOrderDto);
      expect(result).toEqual(mockOrder);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if address not found', async () => {
      jest.spyOn(addressRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.createOrder(1, createOrderDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.createOrder(1, createOrderDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if not enough stock', async () => {
      const createOrderDtoWithLargeQuantity = {
        ...createOrderDto,
        products: [{ product_id: 'c10a95f0-f93b-4c80-bd89-c86c3fd18fc3', unit_quantity: 20 }]
      };
      await expect(service.createOrder(1, createOrderDtoWithLargeQuantity)).rejects.toThrow(BadRequestException);
    });
  });
}); 