import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, JwtRTPayload } from 'src/utilities/types/auth.types';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req.cookies && req.cookies['jwt']) token = req.cookies['jwt'];
  return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtRTPayload {
    console.log(payload);
    const refreshToken = cookieExtractor(req);
    return { refreshToken, ...payload };
  }
}
