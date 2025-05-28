import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      user_mail: 'test@example.com',
      user_password: 'password123',
      user_phone_number: '1234567890',
      user_name: 'Test',
      user_surname: 'User',
      user_birthday_date: '1990-01-01',
    };

    it('should register a new user', async () => {
      const expectedResult = { message: 'Kayıt başarılı' };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(createUserDto);
      expect(result).toEqual(expectedResult);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      user_mail: 'test@example.com',
      user_password: 'password123',
    };

    it('should login and return access token', async () => {
      const expectedResult = { access_token: 'test-token' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);
      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
