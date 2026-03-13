import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/core/user.entity';
import { AuthProvider } from 'src/enum/user.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async validateOAuthUser(payload: {
    email?: string;
    username?: string;
    avatarPath?: string;
    authProvider: AuthProvider;
    authProviderId: string;
  }): Promise<User> {
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

    return this.usersRepository.save(user);
  }
}
