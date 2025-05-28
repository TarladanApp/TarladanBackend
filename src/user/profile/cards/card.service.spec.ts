import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';

const mockUser = {
  user_id: 1,
  user_mail: 'test@example.com',
  user_phone_number: '1234567890',
  user_password: 'password',
  user_name: 'Test',
  user_surname: 'User',
  user_birthday_date: '1990-01-01',
  cards: [],
};

const mockCards = [
  {
    card_id: 1,
    user_id: 1,
    user_card_name: 'Test User',
    user_card_number: '1234567890123456',
    user_card_ending_date: '12/25',
    user_card_code: '123',
    user: mockUser,
  },
];

describe('CardService', () => {
  let service: CardService;
  let repo: Repository<Card>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getRepositoryToken(Card),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({ ...dto, card_id: 1, user: mockUser })),
            save: jest.fn().mockImplementation((card) => Promise.resolve(card)),
            find: jest.fn().mockResolvedValue(mockCards),
            findOne: jest.fn().mockResolvedValue(mockCards[0]),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    repo = module.get<Repository<Card>>(getRepositoryToken(Card));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new card', async () => {
    const createCardDto: CreateCardDto = {
      user_card_name: 'Test User',
      user_card_number: '1234567890123456',
      user_card_ending_date: '12/25',
      user_card_code: '123',
    };
    const result = await service.create(1, createCardDto);
    expect(repo.create).toHaveBeenCalledWith({ ...createCardDto, user_id: 1 });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ ...createCardDto, user_id: 1, card_id: 1, user: mockUser });
  });

  it('findAll should return cards', async () => {
    const result = await service.findAll(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { user_id: 1 } });
    expect(result).toEqual(mockCards);
  });

  it('findOne should return a card', async () => {
    const result = await service.findOne(1, 1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { card_id: 1 } });
    expect(result).toEqual(mockCards[0]);
  });

  it('findOne should throw error if card not found', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(1, 999)).rejects.toThrow('Card with ID 999 not found');
  });

  it('findOne should throw error if user not authorized', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce({ ...mockCards[0], user_id: 2 });
    await expect(service.findOne(1, 1)).rejects.toThrow('You are not authorized to access this card');
  });

  it('remove should delete a card', async () => {
    const result = await service.remove(1, 1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { card_id: 1 } });
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });
}); 