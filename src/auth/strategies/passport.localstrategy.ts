import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDTO } from '../auth-dto/auth.dto';
import { LoginPayload } from 'src/utilities/types/auth.types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authservice: AuthService) {
    super({
      usernameField: 'identifier',
    });
  }

  async validate(identifier: string, password: string): Promise<LoginPayload> {
    const loginData: LoginDTO = { identifier, password };
    return this.authservice.userValidate(loginData);
  }
}
