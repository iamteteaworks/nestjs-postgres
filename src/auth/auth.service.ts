import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/core/users.entity';
import { AuthProvider } from 'src/enum/user.enum';
import { AuthTokens } from './types/auth-tokens.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthUser(payload: {
    email?: string;
    username?: string;
    avatarPath?: string;
    authProvider: AuthProvider;
    authProviderId: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const { email, username, avatarPath, authProvider, authProviderId } =
      payload;

    let user = await this.usersRepository.findOne({
      where: { authProvider, authProviderId },
    });

    if (!user && email) {
      user = await this.usersRepository.findOne({
        where: { email },
      });
    }

    if (!user) {
      user = this.usersRepository.create({
        email: email ?? '',
        username: username ?? '',
        avatarPath: avatarPath ?? '',
        authProvider,
        authProviderId,
      });
    } else {
      user.username = username ?? user.username;
      user.avatarPath = avatarPath ?? user.avatarPath;
      user.authProvider = authProvider;
      user.authProviderId = authProviderId;
    }

    const savedUser = await this.usersRepository.save(user);
    const tokens = this.generateTokens(savedUser);
    return { user: savedUser, tokens };
  }

  generateTokens(user: User): AuthTokens {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ??
        '1d') as `${number}${'d' | 'h' | 'm' | 's'}`,
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
