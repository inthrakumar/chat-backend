import { AuthGuard } from '@nestjs/passport';
export class LocalGuard extends AuthGuard('localk') {
  constructor() {
    super();
  }
}
