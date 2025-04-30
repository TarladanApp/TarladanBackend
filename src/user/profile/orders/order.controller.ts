import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { OrderService } from "./order.service";

@Controller('user/profile/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService){};


    @Get()
    async getOrders(@Req() req) {
        const userId = req.user.userId; 
        return this.orderService.findAll(userId); 
    }

    @Get(':id')
    async getOrder(@Req() req,@Param('id') id: number) {
        const userId = req.user.userId; 
        return this.orderService.findOne(userId, +id); 
    }

}