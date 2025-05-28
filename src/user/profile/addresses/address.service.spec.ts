import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

const mockUser = {
  user_id: 1,
  user_mail: 'test@example.com',
  user_phone_number: '1234567890',
  user_password: 'password',
  user_name: 'Test',
  user_surname: 'User',
  user_birthday_date: '1990-01-01',
  addresses: [],
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
    apartment: 'Test Apartment',
    user: mockUser,
  },
];

describe('AddressService', () => {
  let service: AddressService;
  let repo: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({ ...dto, user_address_id: 1, user: mockUser })),
            save: jest.fn().mockImplementation((address) => Promise.resolve(address)),
            find: jest.fn().mockResolvedValue(mockAddresses),
            findOne: jest.fn().mockResolvedValue(mockAddresses[0]),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    repo = module.get<Repository<Address>>(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new address', async () => {
    const createAddressDto: CreateAddressDto = {
      full_address: 'Random Address',
      city: 'Nice City',
      district: 'Very Good District',
      neighborhood: 'Excellent Neighborhood',
      street: 'Beautiful Street',
      floor: 2,
      apartment: 'Amazing Apartment',
    };
    const result = await service.create(1, createAddressDto);
    expect(repo.create).toHaveBeenCalledWith({ ...createAddressDto, user_id: 1 });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ ...createAddressDto, user_id: 1, user_address_id: 1, user: mockUser });
  });

  it('findAll should return addresses', async () => {
    const result = await service.findAll(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { user_id: 1 } });
    expect(result).toEqual(mockAddresses);
  });

  it('findOne should return an address', async () => {
    const result = await service.findOne(1, 1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { user_address_id: 1 } });
    expect(result).toEqual(mockAddresses[0]);
  });

  it('findOne should throw NotFoundException if address not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(1, 999)).rejects.toThrow('Address with ID 999 not found');
  });

  it('findOne should throw UnauthorizedException if user not authorized', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce({ ...mockAddresses[0], user_id: 2 });
    await expect(service.findOne(1, 1)).rejects.toThrow('You are not authorized to access this address');
  });

  it('remove should delete an address', async () => {
    const result = await service.remove(1, 1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { user_address_id: 1 } });
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });

  it('update should update an address', async () => {
    const updateAddressDto: Partial<UpdateAddressDto> = { 
        full_address: 'Updated Address',
        city: 'Updated City',
        district: 'Updated District',
        neighborhood: 'Updated Neighborhood',
        street: 'Updated Street',
        floor: 2,
        apartment: 'Updated Apartment', 
    };
    const result = await service.update(1, 1, updateAddressDto);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { user_address_id: 1 } });
    expect(repo.update).toHaveBeenCalledWith(1, updateAddressDto);
    expect(result).toEqual({ updated: true });
  });
}); 