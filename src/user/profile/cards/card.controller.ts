import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CardService } from "./card.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { JwtAuthGuard } from "../../../auth/jwt-auth.guard";

@Controller('user/profile/cards')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private readonly cardService : CardService ) {}


    @Post()
    async createCard(@Req() req, @Body() createCardDto: CreateCardDto) {
        const userId = req.user.userId;
        return this.cardService.create(userId, createCardDto);
    }


    @Get()
    async getCards(@Req() req) {
        const userId = req.user.userId;
        return this.cardService.findAll(userId);
    }

    @Get(':id')
    async getCard(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.cardService.findOne(userId, +id);
    }

    @Delete(':id')
    async removeCard(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.cardService.remove(userId, +id);
    }

}