import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
    let controller: OrderController;
    let service: OrderService;

    const mockUser = {
        user_id: 1,
        user_mail: 'test@example.com',
        user_phone_number: '1234567890',
        user_password: 'password',
        user_name: 'Test',
        user_surname: 'User',
        user_birthday_date: '1990-01-01',
        addresses: []
    };

    const mockOrders = [
        {
            order_id: 1,
            user_id: 1,
            delivery_address_id: 1,
            order_date: '2024-03-20',
            estimated_delivery_date: '2024-03-25',
            order_status: 'pending',
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
            user: mockUser,
            orderProducts: []
        }
    ];

    beforeEach(() => {
        service = {
            findAll: jest.fn(),
            findOne: jest.fn()
        } as any;
        controller = new OrderController(service);
    });

    describe('getOrders', () => {
        const mockUserId = 1;
        const mockReq = { user: { userId: mockUserId } };

        it('should return an array of orders', async () => {
            (service.findAll as jest.Mock).mockResolvedValue(mockOrders);

            const result = await controller.getOrders(mockReq);

            expect(service.findAll).toHaveBeenCalledWith(mockUserId);
            expect(result).toBe(mockOrders);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty('order_id');
            expect(result[0]).toHaveProperty('orderProducts');
        });

        it('should return empty array when user has no orders', async () => {
            (service.findAll as jest.Mock).mockResolvedValue([]);

            const result = await controller.getOrders(mockReq);

            expect(result).toEqual([]);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.getOrders(invalidReq as any))
                .rejects
                .toThrow();
        });
    });

    describe('getOrder', () => {
        const mockUserId = 1;
        const mockReq = { user: { userId: mockUserId } };
        const orderId = 1;

        it('should return a single order', async () => {
            (service.findOne as jest.Mock).mockResolvedValue(mockOrders[0]);

            const result = await controller.getOrder(mockReq, orderId);

            expect(service.findOne).toHaveBeenCalledWith(mockUserId, orderId);
            expect(result).toBe(mockOrders[0]);
            expect(result).toHaveProperty('order_id', orderId);
            expect(result).toHaveProperty('orderProducts');
        });

        it('should handle order not found', async () => {
            (service.findOne as jest.Mock).mockRejectedValue(new NotFoundException('Order not found'));

            await expect(controller.getOrder(mockReq, 999))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should handle unauthorized access', async () => {
            (service.findOne as jest.Mock).mockRejectedValue(new UnauthorizedException('Not authorized'));

            await expect(controller.getOrder(mockReq, 2))
                .rejects
                .toThrow(UnauthorizedException);
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.getOrder(invalidReq as any, orderId))
                .rejects
                .toThrow();
        });

        it('should handle invalid order ID', async () => {
            const invalidOrderId = 'invalid';
            (service.findOne as jest.Mock).mockRejectedValue(new BadRequestException('Invalid order ID'));

            await expect(controller.getOrder(mockReq, invalidOrderId as any))
                .rejects
                .toThrow(BadRequestException);
        });
    });
});
