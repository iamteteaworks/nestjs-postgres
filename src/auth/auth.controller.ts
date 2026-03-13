import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from 'src/database/core/users.entity';
import { AuthTokens } from './types/auth-tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: { user: User }): Promise<{
    user: User;
    tokens: AuthTokens;
  }> {
    return this.authService.validateOAuthUser({
      email: req.user.email,
      username: req.user.username,
      avatarPath: req.user.avatarPath ?? undefined,
      authProvider: req.user.authProvider,
      authProviderId: req.user.authProviderId,
    });
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.refreshTokens(refreshToken);
    return tokens;
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  profile(@Req() req: { user: User }): {
    user: User;
    tokens: AuthTokens;
  } {
    const tokens = this.authService.generateTokens(req.user);
    return { user: req.user, tokens };
  }
}
