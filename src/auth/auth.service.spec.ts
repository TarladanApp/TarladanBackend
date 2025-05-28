import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    user_id: 1,
    user_mail: 'test@example.com',
    user_phone_number: '1234567890',
    user_password: 'hashedPassword',
    user_name: 'Test',
    user_surname: 'User',
    user_birthday_date: '1990-01-01',
    addresses: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerData = {
      user_mail: 'test@example.com',
      user_password: 'password123',
      user_phone_number: '1234567890',
      user_name: 'Test',
      user_surname: 'User',
      user_birthday_date: '1990-01-01',
    };

    it('should register a new user successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.register(registerData);
      expect(result).toEqual({ message: 'Kayıt başarılı' });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { user_mail: registerData.user_mail } });
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.register(registerData)).rejects.toThrow(BadRequestException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { user_mail: registerData.user_mail } });
    });
  });

  describe('login', () => {
    const loginData = {
      user_mail: 'test@example.com',
      user_password: 'password123',
    };

    it('should login successfully and return access token', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(loginData);
      expect(result).toEqual({ access_token: 'test-token' });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { user_mail: loginData.user_mail } });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { user_mail: mockUser.user_mail, user_id: mockUser.user_id },
        { expiresIn: '1h' }
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { user_mail: loginData.user_mail } });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginData)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { user_mail: loginData.user_mail } });
    });
  });
});
