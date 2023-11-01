import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { UserTokenData } from './interfaces/user-token-data.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@RequestUser() user: UserTokenData): Promise<LoginResponse> {
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(@RequestUser() user: UserTokenData): Promise<LoginResponse> {
    return this.authService.login(user);
  }

  @Get('logout')
  logout(@RequestUser() user: UserTokenData): Promise<void> {
    return this.authService.logout(user.id);
  }

  @Patch('password')
  async updateSelfPassword(
    @RequestUser() userReq: UserTokenData,
    @Body() { oldPassword, newPassword }: ChangePasswordDto,
  ): Promise<User> {
    if (oldPassword === newPassword)
      throw new BadRequestException(
        'New password must be different from old password',
      );

    const oltPassTest = await this.authService.validateUser(
      userReq.username,
      oldPassword,
    );
    if (!oltPassTest) throw new BadRequestException('Invalid old password');

    const user = await this.usersService.updatePassword(
      userReq.id,
      newPassword,
      false,
    );
    if (!user) throw new BadRequestException('Napaka pri menjavi gesla');
    return user;
  }
}
