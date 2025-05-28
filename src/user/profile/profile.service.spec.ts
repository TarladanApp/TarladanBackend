import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Address } from './addresses/address.entity';
import { Card } from './cards/card.entity';
import { Order } from './orders/entities/order.entity';
import { Repository } from 'typeorm';

describe('ProfileService', () => {
  let service: ProfileService;
  let userRepository: Repository<User>;
  let addressRepository: Repository<Address>;
  let cardRepository: Repository<Card>;
  let orderRepository: Repository<Order>;

  const mockUser = {
    user_id: 1,
    user_mail: 'test@example.com',
    user_name: 'Test',
    user_surname: 'User',
    user_phone_number: '1234567890',
    user_birthday_date: '1990-01-01'
  };

  const mockAddresses = [
    {
      user_address_id: 1,
      user_id: 1,
      full_address: 'Test Address',
      city: 'Test City',
      district: 'Test District',
      neighborhood: 'Test Neighborhood',
      street: 'Test Street',
      floor: 1,
      apartment: 'Test Apartment'
    }
  ];

  const mockCards = [
    {
      card_id: 1,
      user_id: 1,
      user_card_name: 'Test Card',
      user_card_number: '1234567890123456',
      user_card_ending_date: '12/25',
      user_card_code: '123'
    }
  ];

  const mockOrders = [
    {
      order_id: 1,
      user_id: 1,
      order_date: '2024-03-20',
      order_status: 'pending',
      delivery_address_id: 1,
      estimated_delivery_date: '2024-03-25',
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
      orderProducts: []
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser)
          }
        },
        {
          provide: getRepositoryToken(Address),
          useValue: {
            find: jest.fn().mockResolvedValue(mockAddresses)
          }
        },
        {
          provide: getRepositoryToken(Card),
          useValue: {
            find: jest.fn().mockResolvedValue(mockCards)
          }
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn().mockResolvedValue(mockOrders)
          }
        }
      ]
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    addressRepository = module.get<Repository<Address>>(getRepositoryToken(Address));
    cardRepository = module.get<Repository<Card>>(getRepositoryToken(Card));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile with addresses, cards and orders', async () => {
      const result = await service.getProfile(1);
      expect(result).toEqual({
        user: mockUser,
        addresses: mockAddresses,
        cards: mockCards,
        orders: mockOrders
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
        select: ['user_id', 'user_mail', 'user_name', 'user_surname', 'user_phone_number', 'user_birthday_date']
      });
      expect(addressRepository.find).toHaveBeenCalledWith({
        where: { user_id: 1 }
      });
      expect(cardRepository.find).toHaveBeenCalledWith({
        where: { user_id: 1 }
      });
      expect(orderRepository.find).toHaveBeenCalledWith({
        where: { user_id: 1 },
        order: { order_date: 'DESC' }
      });
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.getProfile(999)).rejects.toThrow('User with ID 999 not found');
    });
  });
}); 