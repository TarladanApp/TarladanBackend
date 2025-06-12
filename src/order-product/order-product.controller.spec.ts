import { OrderProductController } from "./order-product.controller";
import { OrderProductService } from "./order-product.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('OrderProductController', () => {
    let controller: OrderProductController;
    let service: OrderProductService;

    beforeEach(() => {
        service = {
            createOrder: jest.fn()
        } as any;
        controller = new OrderProductController(service);
    });

    describe('createOrder', () => {
        const mockUserId = 123;
        const mockReq = { user: { userId: mockUserId } };
        const mockCreateOrderDto: CreateOrderDto = {
            delivery_address_id: 1,
            use_any_coupon: false,
            products: [
                {
                    product_id: 'c10a95f0-f93b-4c80-bd89-c86c3fd18fc3',
                    unit_quantity: 2
                }
            ]
        };

        it('should call service.createOrder with correct parameters and return result', async () => {
            const mockResult = {
                order_id: 1,
                user_id: mockUserId,
                order_status: 'pending',
                order_date: expect.any(String),
                delivery_address_id: mockCreateOrderDto.delivery_address_id,
                estimated_delivery_date: expect.any(String),
                use_any_coupon: mockCreateOrderDto.use_any_coupon,
                orderProducts: []
            };
            (service.createOrder as jest.Mock).mockResolvedValue(mockResult);

            const result = await controller.createOrder(mockReq, mockCreateOrderDto);

            expect(service.createOrder).toHaveBeenCalledWith(mockUserId, mockCreateOrderDto);
            expect(result).toBe(mockResult);
        });

        it('should handle NotFoundException from service', async () => {
            (service.createOrder as jest.Mock).mockRejectedValue(new NotFoundException('Address not found'));

            await expect(controller.createOrder(mockReq, mockCreateOrderDto))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should handle BadRequestException from service', async () => {
            (service.createOrder as jest.Mock).mockRejectedValue(new BadRequestException('Not enough stock'));

            await expect(controller.createOrder(mockReq, mockCreateOrderDto))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should handle invalid request without user', async () => {
            const invalidReq = {};

            await expect(controller.createOrder(invalidReq as any, mockCreateOrderDto))
                .rejects
                .toThrow();
        });
    });
});