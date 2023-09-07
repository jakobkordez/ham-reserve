import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { UserTokenData } from './interfaces/user-token-data.interface';
import { LoginResponse } from './interfaces/login-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
