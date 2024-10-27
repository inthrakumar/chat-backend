import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
      passReqToCallback: 'true',
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return { refreshToken, ...payload };
  }
}
