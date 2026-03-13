import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from 'src/database/core/user.entity';
import { AuthTokens } from './types/auth-tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: { user: User }): Promise<{
    user: User;
    tokens: AuthTokens;
  }> {
    return this.authService.validateOAuthUser(req.user);
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.refreshTokens(refreshToken);
    return tokens;
  }
}
