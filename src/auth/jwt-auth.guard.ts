import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Gives Postman a readable reason instead of a bare "Unauthorized".
  handleRequest(err: any, user: any, info: any, context?: ExecutionContext, status?: any) {
    if (err || !user) {
      if (err) throw err;
      let message = 'Invalid or missing token';
      if (info?.name === 'TokenExpiredError') message = 'Token has expired';
      else if (info?.message === 'No auth token') message = 'Missing bearer token (send header: Authorization: Bearer <token>)';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
