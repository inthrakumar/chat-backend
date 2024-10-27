import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/accesstoken.strategy';
import { RefreshTokenStrategy } from './strategies/refereshtoken.strategy';
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
