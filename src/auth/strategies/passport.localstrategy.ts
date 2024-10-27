import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDTO } from '../auth-dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authservice: AuthService) {
    super({
      usernameField: 'identifier',
    });
  }

  async validate(
    identifier: string,
    password: string,
  ): Promise<{
    id: string;
    username: string;
    email: string;
  }> {
    const loginData: LoginDTO = { identifier, password };
    return this.authservice.userValidate(loginData);
  }
}
