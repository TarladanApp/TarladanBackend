import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceService } from './performance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import * as pidusage from 'pidusage';

jest.mock('pidusage', () => jest.fn().mockResolvedValue({ cpu: 10 }));

describe('PerformanceService', () => {
  let service: PerformanceService;
  let productRepository: Repository<Product>;
  let productService: ProductService;
  let userService: UserService;

  const mockProducts = [
    {
      product_id: 1,
      product_name: 'Test Product',
      product_price: 100,
      product_description: 'Test Description',
      product_stock: 10,
      product_category: 'Test Category',
      product_image: 'test.jpg'
    }
  ];

  const mockUsers = [
    {
      user_id: 1,
      user_mail: 'test@example.com',
      user_phone_number: '1234567890',
      user_password: 'password',
      user_name: 'Test',
      user_surname: 'User',
      user_birthday_date: '1990-01-01'
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerformanceService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            count: jest.fn().mockResolvedValue(mockProducts.length)
          }
        },
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockProducts)
          }
        },
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockUsers)
          }
        }
      ]
    }).compile();

    service = module.get<PerformanceService>(PerformanceService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    productService = module.get<ProductService>(ProductService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductPerformanceMetrics', () => {
    it('should return product performance metrics', async () => {
      const result = await service.getProductPerformanceMetrics();

      expect(result).toBeDefined();
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
      expect(result.memoryUsedKb).toBeGreaterThanOrEqual(0);
      expect(result.recordCount).toBe(mockProducts.length);
      expect(result.cpuPercent).toBe(10);
      expect(productService.findAll).toHaveBeenCalled();
      expect(productRepository.count).toHaveBeenCalled();
    });
  });

  describe('getUserPerformanceMetrics', () => {
    it('should return user performance metrics', async () => {
      const result = await service.getUserPerformanceMetrics();

      expect(result).toBeDefined();
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
      expect(result.memoryUsedKb).toBeGreaterThanOrEqual(0);
      expect(result.recordCount).toBe(mockUsers.length);
      expect(result.cpuPercent).toBe(10);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('calculateMemoryUsage', () => {
    it('should calculate memory usage in KB', () => {
      const startMemory = 1000;
      const endMemory = 2000;
      const result = (service as any).calculateMemoryUsage(startMemory, endMemory);
      expect(result).toBeCloseTo(0.9765625, 5); // (2000 - 1000) / 1024 = 0.9765625
    });
  });
}); 