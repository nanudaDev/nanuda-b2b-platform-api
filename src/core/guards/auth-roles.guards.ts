require('dotenv').config();
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ADMIN_USER, COMPANY_USER } from 'src/shared';
import { ENVIRONMENT } from 'src/config';
@Injectable()
export class AuthRolesGuard extends AuthGuard('jwt') {
  readonly roles: (ADMIN_USER | COMPANY_USER)[];
  constructor(...roles: (ADMIN_USER | COMPANY_USER)[]) {
    super();
    this.roles = roles;
  }

  handleRequest(err, user, info, context: ExecutionContextHost) {
    if (err || !user) {
      if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
        console.log(err, 'err');
        console.log(user, 'user');
      }
      throw err ||
        new UnauthorizedException({
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
          error: 401,
        });
    }
    if (this.roles.length) {
      const newArray = [];
      const arrayedRoles = user.authCode.split(',');
      arrayedRoles.map(levels => newArray.push(levels));
      const hasRoles = () => this.roles.some(role => newArray.includes(role));
      if (!user || !hasRoles()) {
        throw new ForbiddenException({
          message: '죄송합니다. 권한이 없습니다.',
          error: 403,
        });
      }
    }
    return user;
  }
}
