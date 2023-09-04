import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserTokenPayload } from './interfaces/user-token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserTokenData } from './interfaces/user-token-data.interface';
import { isMongoId } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;

    return user;
  }

  /**
   * Use to login or refresh tokens
   * @param user User to login
   * @returns Access and refresh tokens
   */
  async login(user: UserTokenData) {
    const payload: UserTokenPayload = {
      username: user.username,
      sub: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(payload),
      this.getRefreshToken(payload),
    ]);

    // Update refresh token
    await this.usersService.setRefreshToken(
      user.id,
      refreshToken.split('.')[2],
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Sets refresh token to `null`
   * @param userId User to logout
   */
  async logout(userId: string) {
    await this.usersService.setRefreshToken(userId, null);
  }

  /**
   * Checks if user exists and if refresh token matches
   * @param token Refresh token to validate
   * @returns `true` if valid, `false` otherwise
   */
  async validateRefreshToken(token: string): Promise<boolean> {
    const payload = this.jwtService.decode(token) as UserTokenPayload;
    if (!payload) return false;

    const userId = payload.sub;
    if (!userId || !isMongoId(userId)) return false;

    const user = await this.usersService.findOne(userId);
    if (!user) return false;

    return bcrypt.compare(token.split('.')[2], user.auth);
  }

  // PRIVATE FUNCTIONS
  private async getAccessToken(payload: UserTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async getRefreshToken(payload: UserTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
