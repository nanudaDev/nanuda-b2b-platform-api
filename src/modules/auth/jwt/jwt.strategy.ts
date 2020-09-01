require('dotenv').config();
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserSigninPayload, UserType } from '..';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * validate user
   * @param payload
   */
  async validate(payload: UserSigninPayload): Promise<any> {
    let user;
    if (payload.userType === UserType.COMPANY_USER) {
      user = await this.authService.validateUserById(payload._no);
    } else if (payload.userType === UserType.ADMIN) {
      user = await this.authService.validateAdminById(payload._no);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
