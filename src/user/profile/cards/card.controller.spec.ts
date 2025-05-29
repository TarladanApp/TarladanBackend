import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';

describe('CardController', () => {
    let controller: CardController;
    let service: CardService;

    const mockCard = {
        card_id: 1,
        user_id: 1,
        user_card_name: 'Test User',
        user_card_number: '1234567890123456',
        user_card_ending_date: '12/25',
        user_card_code: '123'
    };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn()
        } as any;
        controller = new CardController(service);
    });

    describe('createCard', () => {
        const mockUserId = 1;
        const mockReq = { user: { userId: mockUserId } };
        const mockCreateCardDto: CreateCardDto = {
            user_card_name: 'Test User',
            user_card_number: '1234567890123456',
            user_card_ending_date: '12/25',
            user_card_code: '123'
        };

        it('should create a new card', async () => {
            (service.create as jest.Mock).mockResolvedValue(mockCard);

            const result = await controller.createCard(mockReq, mockCreateCardDto);

            expect(service.create).toHaveBeenCalledWith(mockUserId, mockCreateCardDto);
            expect(result).toBe(mockCard);
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.createCard(invalidReq as any, mockCreateCardDto))
                .rejects
                .toThrow();
        });
    });

    describe('getCards', () => {
        const mockUserId = 1;
        const mockReq = { user: { userId: mockUserId } };
        const mockCards = [mockCard];

        it('should return all cards for user', async () => {
            (service.findAll as jest.Mock).mockResolvedValue(mockCards);

            const result = await controller.getCards(mockReq);

            expect(service.findAll).toHaveBeenCalledWith(mockUserId);
            expect(result).toBe(mockCards);
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.getCards(invalidReq as any))
                .rejects
                .toThrow();
        });
    });

    describe('getCard', () => {
        const mockUserId = 1;
        const mockReq = { user: { userId: mockUserId } };
        const cardId = '1';

        it('should return a single card', async () => {
            (service.findOne as jest.Mock).mockResolvedValue(mockCard);

            const result = await controller.getCard(mockReq, cardId);

            expect(service.findOne).toHaveBeenCalledWith(mockUserId, +cardId);
            expect(result).toBe(mockCard);
        });

        it('should handle card not found', async () => {
            (service.findOne as jest.Mock).mockRejectedValue(new Error('Card not found'));

            await expect(controller.getCard(mockReq, '999'))
                .rejects
                .toThrow('Card not found');
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.getCard(invalidReq as any, cardId))
                .rejects
                .toThrow();
        });
    });

    describe('removeCard', () => {
        const mockUserId = 1;
        const mockReq = { user: { userId: mockUserId } };
        const cardId = '1';

        it('should remove a card', async () => {
            (service.remove as jest.Mock).mockResolvedValue({ deleted: true });

            const result = await controller.removeCard(mockReq, cardId);

            expect(service.remove).toHaveBeenCalledWith(mockUserId, +cardId);
            expect(result).toEqual({ deleted: true });
        });

        it('should handle card not found', async () => {
            (service.remove as jest.Mock).mockRejectedValue(new Error('Card not found'));

            await expect(controller.removeCard(mockReq, '999'))
                .rejects
                .toThrow('Card not found');
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.removeCard(invalidReq as any, cardId))
                .rejects
                .toThrow();
        });
    });
});
