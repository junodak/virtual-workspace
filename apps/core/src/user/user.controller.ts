import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: { user: { userId: string } }): Promise<UserProfileDto> {
    const user = await this.userService.findById(req.user.userId);
    return UserProfileDto.from(user);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const user = await this.userService.updateProfile(req.user.userId, dto);
    return UserProfileDto.from(user);
  }
}
