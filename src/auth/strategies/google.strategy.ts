import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { AuthProvider } from 'src/enum/user.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    const options: StrategyOptions = {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/auth/google/callback',
      scope: ['email', 'profile'],
    };

    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    const username = profile.displayName;
    const avatarPath = profile.photos?.[0]?.value;

    return this.authService.validateOAuthUser({
      email,
      username,
      avatarPath,
      authProvider: AuthProvider.GOOGLE,
      authProviderId: profile.id,
    });
  }
}
