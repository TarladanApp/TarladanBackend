import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUsers = [
    {
      user_id: 1,
      user_mail: 'test@example.com',
      user_phone_number: '1234567890',
      user_password: 'password',
      user_name: 'Test',
      user_surname: 'User',
      user_birthday_date: '1990-01-01',
      addresses: []
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(mockUsers),
            findOne: jest.fn().mockResolvedValue(mockUsers[0])
          }
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUsers[0]);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { user_id: 1 } });
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow('User with ID 999 not found');
    });
  });
});
