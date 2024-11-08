import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/utilities/types/auth.types';
const headerExtractor = (req: Request) => {
  let token = null;

  if (req.headers && req.headers['authorization']) {
    const parts = req.headers['authorization'].split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  return token;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: headerExtractor,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
