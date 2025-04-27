import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Card } from "./card.entity";
import { Repository } from "typeorm";
import { CreateCardDto } from "./dto/create-card.dto";

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}


  async create(userId: number, createCardDto : CreateCardDto) {
    const newCard = this.cardRepository.create({
      ...createCardDto,
      user_id: userId,     
   });
    return this.cardRepository.save(newCard);
   }

   async findAll(userId: number) {
    return this.cardRepository.find({
      where: { user_id: userId },
    }); 
   }

    async findOne(userId: number, id: number) {
     const card = await this.cardRepository.findOne({
        where: { card_id: id },
     });
    
     if (!card) {
        throw new Error(`Card with ID ${id} not found`);
     }
    
     if (card.user_id !== userId) {
        throw new Error("You are not authorized to access this card");
     }
    
     return card;
    }

   async remove(userId:number, id: number) {
    const card = await this.cardRepository.findOne({
      where: {card_id : id },
    });

    if (!card) {
      throw new Error(`Card with ID ${id} not found`);
    }

    if (card.user_id !== userId) {
      throw new Error("You are not authorized to access this card");
    }

    await this.cardRepository.delete(id);
    return { deleted: true };

   }
}