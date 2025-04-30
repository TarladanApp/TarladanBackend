import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from '../profile/addresses/address.entity';

@Entity('user_table')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  user_mail: string;

  @Column()
  user_phone_number: string;

  @Column()
  user_password: string;

  @Column()
  user_name: string;

  @Column()
  user_surname: string;

  @Column()
  user_birthday_date: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}