import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue(mockUsers)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
