import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const requireCredentials = this.reflector.getAllAndOverride<string[]>("credentials", [
      context.getHandler(),
      context.getClass(),
    ]);

    const requireRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (!requireCredentials && !requireRoles) return true;

    if (!req?.user) throw new UnauthorizedException();
    const hasCredentials = () => requireCredentials.every((credential) => req.user.credentials.includes(credential));
    const hasRole = () => !!requireRoles.find(role => req.user.role == role);
    if (req.user
      && (
        (requireCredentials && req.user.credentials && hasCredentials())
        || (requireRoles && hasRole())
      )
    ) return true;
    else throw new UnauthorizedException();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}