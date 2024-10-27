import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
export class AtGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

}