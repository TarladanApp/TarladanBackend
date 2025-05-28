import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

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

  const mockAddressService = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue(mockAddresses),
    findOne: jest.fn().mockResolvedValue(mockAddresses[0]),
    remove: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(mockAddresses[0])
  };

  const mockRequest = {
    user: {
      userId: 1
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: mockAddressService
        }
      ]
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAddress', () => {
    const createAddressDto: CreateAddressDto = {
      full_address: 'Test Address',
      city: 'Test City',
      district: 'Test District',
      neighborhood: 'Test Neighborhood',
      street: 'Test Street',
      floor: 1,
      apartment: 'Test Apartment'
    };

    it('should create a new address', async () => {
      mockAddressService.create.mockResolvedValueOnce(mockAddresses[0]);
      const result = await controller.createAddress(mockRequest, createAddressDto);
      expect(result).toEqual(mockAddresses[0]);
      expect(service.create).toHaveBeenCalledWith(mockRequest.user.userId, createAddressDto);
    });
  });

  describe('getAddresses', () => {
    it('should return an array of addresses', async () => {
      const result = await controller.getAddresses(mockRequest);
      expect(result).toEqual(mockAddresses);
      expect(service.findAll).toHaveBeenCalledWith(mockRequest.user.userId);
    });
  });

  describe('getAddress', () => {
    it('should return a single address', async () => {
      const result = await controller.getAddress(mockRequest, '1');
      expect(result).toEqual(mockAddresses[0]);
      expect(service.findOne).toHaveBeenCalledWith(mockRequest.user.userId, 1);
    });
  });

  describe('removeAddress', () => {
    it('should remove an address', async () => {
      const result = await controller.removeAddress(mockRequest, '1');
      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith(mockRequest.user.userId, 1);
    });
  });

  describe('updateAddress', () => {
    const updateAddressDto = {
      full_address: 'Updated Address',
      city: 'Updated City',
      district: 'Updated District',
      neighborhood: 'Updated Neighborhood',
      street: 'Updated Street',
      floor: 2,
      apartment: 'Updated Apartment'
    };

    it('should update an address', async () => {
      const result = await controller.updateAddress(mockRequest, '1', updateAddressDto);
      expect(result).toEqual(mockAddresses[0]);
      expect(service.update).toHaveBeenCalledWith(mockRequest.user.userId, 1, updateAddressDto);
    });
  });
});