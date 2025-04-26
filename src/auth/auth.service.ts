import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    ){}

    async register(userData: any) {
        const { user_mail, user_password } = userData;
    
        const existingUser = await this.userRepository.findOne({ where: { user_mail } });
        if (existingUser) {
          throw new BadRequestException('Kullanıcı zaten var.');
        }
    
        const hashedPassword = await bcrypt.hash(user_password, 10);
    
        const newUser = this.userRepository.create({
          ...userData,
          user_password: hashedPassword,
        });
    
    await this.userRepository.save(newUser);
    return { message: 'Kayıt başarılı' };

    }


    

    async login(userData: any){
        const { user_mail, user_password } = userData;

        const user = await this.userRepository.findOne({ where: { user_mail } });
        if(!user){
            throw new UnauthorizedException("Kullanıcı bulunamadı.");
        }

        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
        if(!isPasswordValid){
            throw new UnauthorizedException("Şifre hatalı.");
        }

        const payload = { user_mail: user.user_mail, user_id: user.user_id };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });

        return {access_token: token};
    }
}
