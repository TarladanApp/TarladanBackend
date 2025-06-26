import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

const mockProducts = [
  {
    product_id: 1,
    farmer_id: 1,
    product_katalog_name: 'Sebze',
    product_name: 'Domates',
    farmer_price: 10,
    tarladan_commission: 2,
    tarladan_price: 12,
    stock_quantity: 100,
    product_rating: 4.5,
  },
];

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue(mockProducts),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return products', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    expect(result).toEqual(mockProducts);
  });
}); 