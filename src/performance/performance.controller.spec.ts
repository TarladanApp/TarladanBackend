import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { PerformanceDto } from './dto/performance.dto';

describe('PerformanceController', () => {
  let controller: PerformanceController;
  let service: PerformanceService;

  const mockPerformanceDto: PerformanceDto = {
    durationMs: 100,
    memoryUsedKb: 1024,
    recordCount: 10,
    cpuPercent: 5
  };

  const mockPerformanceService = {
    getProductPerformanceMetrics: jest.fn().mockResolvedValue(mockPerformanceDto),
    getUserPerformanceMetrics: jest.fn().mockResolvedValue(mockPerformanceDto)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceController],
      providers: [
        {
          provide: PerformanceService,
          useValue: mockPerformanceService
        }
      ]
    }).compile();

    controller = module.get<PerformanceController>(PerformanceController);
    service = module.get<PerformanceService>(PerformanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPerformance', () => {
    it('should return product performance metrics', async () => {
      const result = await controller.getPerformance();

      expect(result).toBeDefined();
      expect(result).toEqual(mockPerformanceDto);
      expect(service.getProductPerformanceMetrics).toHaveBeenCalled();
    });
  });

  describe('getUserPerformance', () => {
    it('should return user performance metrics', async () => {
      const result = await controller.getUserPerformance();

      expect(result).toBeDefined();
      expect(result).toEqual(mockPerformanceDto);
      expect(service.getUserPerformanceMetrics).toHaveBeenCalled();
    });
  });
}); 