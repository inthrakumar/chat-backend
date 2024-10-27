import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, JwtRTPayload } from 'src/utilities/types/auth.types';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
      passReqToCallback: 'true',
    });
  }

  validate(req: Request, payload: JwtPayload): JwtRTPayload {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { refreshToken, ...payload };
  }
}
