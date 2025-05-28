import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  const mockUser = {
    user_id: 1,
    user_mail: 'test@example.com',
    user_phone_number: '1234567890',
    user_password: 'password',
    user_name: 'Test',
    user_surname: 'User',
    user_birthday_date: '1990-01-01',
    addresses: []
  };

  const mockOrders = [
    {
      order_id: 1,
      user_id: 1,
      delivery_address_id: 1,
      order_date: '2024-03-20',
      estimated_delivery_date: '2024-03-25',
      order_status: 'pending',
      delivery_date: '',
      use_any_coupon: false,
      rate_for_order: 0,
      address_full: 'Test Address',
      address_city: 'Test City',
      address_district: 'Test District',
      address_neighborhood: 'Test Neighborhood',
      address_street: 'Test Street',
      address_floor: 1,
      address_apartment: 'Test Apartment',
      user: mockUser,
      orderProducts: []
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn().mockResolvedValue(mockOrders),
            findOne: jest.fn().mockResolvedValue(mockOrders[0]),
            create: jest.fn().mockImplementation((dto) => ({ ...dto, order_id: 1 })),
            save: jest.fn().mockImplementation((order) => Promise.resolve(order)),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const result = await service.findAll(1);
      expect(result).toEqual(mockOrders);
      expect(repository.find).toHaveBeenCalledWith({
        where: { user_id: 1 },
        order: { order_date: 'DESC' },
        relations: ['orderProducts'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockOrders[0]);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { order_id: 1 },
        relations: ['orderProducts'],
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(1, 999)).rejects.toThrow('Order with id 999 not found');
    });

    it('should throw UnauthorizedException if user not authorized', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({ ...mockOrders[0], user_id: 2 });
      await expect(service.findOne(1, 1)).rejects.toThrow('You are not authorized to access this order');
    });
  });
}); 