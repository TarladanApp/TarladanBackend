import { Controller, Get } from "@nestjs/common";
import { PerformanceDto } from "./dto/performance.dto";
import { PerformanceService } from "./performance.service";


@Controller("performance")
export class PerformanceController {
    constructor(
        private readonly performanceService: PerformanceService) {}

    @Get("fetch-product")
    async getPerformance(): Promise<PerformanceDto> {
        return this.performanceService.getProductPerformanceMetrics();
    }   

    @Get("fetch-user")
    async getUserPerformance(): Promise<PerformanceDto> {
        return this.performanceService.getUserPerformanceMetrics();
    }
}