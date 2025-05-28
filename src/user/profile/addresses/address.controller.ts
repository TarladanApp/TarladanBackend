import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';


@Controller('user/profile/addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Req() req, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.userId;
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  async getAddresses(@Req() req) {
    const userId = req.user.userId;
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  async getAddress(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.addressService.findOne(userId, +id);
  }

  @Delete(':id')
  async removeAddress(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.addressService.remove(userId, +id);
  }

  @Put(':id')
  async updateAddress(@Req() req, @Param('id') id: string, @Body() updateAddressDto: Partial<UpdateAddressDto>) {
    const userId = req.user.userId;
    const addressId = +id;
    return this.addressService.update(userId, addressId, updateAddressDto);
  }
}