import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class LoginDto {
  @IsEmail()
  user_mail: string;

  @IsString()
  @IsNotEmpty()
  user_password: string;
}
