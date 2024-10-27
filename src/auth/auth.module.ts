import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/passport.accesstokenstrategy';
import { RefreshTokenStrategy } from './strategies/passport.refreshtokenstrategy';
import { LocalStrategy } from './strategies/passport.localstrategy';
@Module({
  imports: [ConfigModule, PassportModule.register({}), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
    LocalStrategy,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
