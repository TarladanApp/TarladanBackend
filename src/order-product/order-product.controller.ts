import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { OrderProductService } from "./order-product.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderProductController {
    constructor(private readonly orderProductService: OrderProductService){};

    @Post()
    async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user.userId; 
        return this.orderProductService.createOrder(userId, createOrderDto); 
    }


}