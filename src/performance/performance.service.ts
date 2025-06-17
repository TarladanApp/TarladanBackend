import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../product/entities/product.entity";
import { Repository } from "typeorm";
import { PerformanceDto } from "./dto/performance.dto";
import * as pidusage from 'pidusage';
import { ProductService } from "../product/product.service";
import { UserService } from "../user/user.service";

@Injectable()
export class PerformanceService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) {}

    private calculateMemoryUsage(startMemory: number, endMemory: number): number {
        return (endMemory - startMemory) / 1024;
    }

    async getProductPerformanceMetrics(): Promise<PerformanceDto> {
        const startTime = Date.now();
        const startMemory = process.memoryUsage().heapUsed;

        const products = await this.productService.findAll();
        const jsonSizeKb = Buffer.byteLength(JSON.stringify(products), 'utf8') / 1024;

        const endMemory = process.memoryUsage().heapUsed;
        const endTime = Date.now();

        const recordCount = await this.productRepository.count();
        const durationMs = endTime - startTime;
        const memoryUsedKb = this.calculateMemoryUsage(startMemory, endMemory);

        const {cpu} = await pidusage(process.pid);

        const dto = new PerformanceDto();
        dto.durationMs = durationMs;
        dto.memoryUsedKb = memoryUsedKb;
        dto.recordCount = recordCount;
        dto.cpuPercent = cpu; 
        dto.jsonSizeKb = jsonSizeKb;

        return dto;
    }

    async getUserPerformanceMetrics(): Promise<PerformanceDto> {
        const startTime = Date.now();
        const startMemory = process.memoryUsage().heapUsed;

        await this.userService.findAll();

        const endMemory = process.memoryUsage().heapUsed;
        const endTime = Date.now();

        const recordCount = await this.userService.findAll().then(users => users.length);
        const durationMs = endTime - startTime;
        const memoryUsedKb = this.calculateMemoryUsage(startMemory, endMemory);

        const {cpu} = await pidusage(process.pid);

        const dto = new PerformanceDto();
        dto.durationMs = durationMs;
        dto.memoryUsedKb = memoryUsedKb;
        dto.recordCount = recordCount;
        dto.cpuPercent = cpu;

        return dto;
    }
}