import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from 'src/database/core/users.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ??
          '1d') as `${number}${'d' | 'h' | 'm' | 's'}`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
