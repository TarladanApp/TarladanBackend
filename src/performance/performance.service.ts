import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/product/entities/product.entity";
import { Repository } from "typeorm";
import { PerformanceDto } from "./dto/performance.dto";
import * as pidusage from 'pidusage';

@Injectable()
export class PerformanceService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    private calculateMemoryUsage(startMemory: number, endMemory: number): number {
        return (endMemory - startMemory) / 1024;
    }

    async getPerformanceMetrics(): Promise<PerformanceDto> {
        const startTime = Date.now();
        const startMemory = process.memoryUsage().heapUsed;

        const recordCount = await this.productRepository.count();

        const endMemory = process.memoryUsage().heapUsed;
        const endTime = Date.now();

        const durationMs = endTime - startTime;
        const memoryUsedKb = this.calculateMemoryUsage(startMemory, endMemory);

        const { cpu} = await pidusage(process.pid);

        const dto = new PerformanceDto();
        dto.durationMs = durationMs;
        dto.memoryUsedKb = memoryUsedKb;
        dto.recordCount = recordCount;
        dto.cpuPercent = cpu; 

        return dto;
    }
}