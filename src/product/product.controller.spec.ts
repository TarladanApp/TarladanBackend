import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

describe('ProductController', () => {
    let controller: ProductController;
    let service: ProductService;

    const mockProducts = [
        {
            product_id: 1,
            product_name: 'Test Product',
            product_price: 100,
            product_quantity: 10
        },
        {
            product_id: 2,
            product_name: 'Another Product',
            product_price: 200,
            product_quantity: 5
        }
    ];
    
    const mockProductService = {
        findAll: jest.fn().mockResolvedValue(mockProducts)
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
             {
                provide:ProductService,
                useValue:mockProductService
             }
            ]
        }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('FindAllProducts', () => {
    it('should return an array of products', async () => {
        const result = await controller.getAllProducts();
        expect(result).toEqual(mockProducts);
        expect(service.findAll).toHaveBeenCalled();
        })
    });    
});