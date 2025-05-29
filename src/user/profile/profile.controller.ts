import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ProfileService } from "./profile.service";




@Controller("user/profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    return this.profileService.getProfile(userId);
  }
}