import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
    let controller: ProfileController;
    let service: ProfileService;

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

    const mockProfile = {
        user: mockUser,
        addresses: mockAddresses,
        cards: mockCards,
        orders: mockOrders
    };

    beforeEach(() => {
        service = {
            getProfile: jest.fn()
        } as any;
        controller = new ProfileController(service);
    });

    describe('getProfile', () => {
        const mockUserId = 1;
        const mockReq = { user: { userId: mockUserId } };

        it('should return user profile with addresses, cards and orders', async () => {
            (service.getProfile as jest.Mock).mockResolvedValue(mockProfile);

            const result = await controller.getProfile(mockReq);

            expect(service.getProfile).toHaveBeenCalledWith(mockUserId);
            expect(result).toBe(mockProfile);
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('addresses');
            expect(result).toHaveProperty('cards');
            expect(result).toHaveProperty('orders');
        });

        it('should handle user not found', async () => {
            (service.getProfile as jest.Mock).mockRejectedValue(new Error('User not found'));

            await expect(controller.getProfile(mockReq))
                .rejects
                .toThrow('User not found');
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.getProfile(invalidReq as any))
                .rejects
                .toThrow();
        });

        it('should return profile with empty arrays when user has no data', async () => {
            const emptyProfile = {
                user: mockUser,
                addresses: [],
                cards: [],
                orders: []
            };
            (service.getProfile as jest.Mock).mockResolvedValue(emptyProfile);

            const result = await controller.getProfile(mockReq);

            expect(result).toBe(emptyProfile);
            expect(result.addresses).toHaveLength(0);
            expect(result.cards).toHaveLength(0);
            expect(result.orders).toHaveLength(0);
        });
    });
});
