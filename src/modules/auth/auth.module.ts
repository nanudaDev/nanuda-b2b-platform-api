import { Module } from '@nestjs/common';
import { Admin } from '../admin';
import { AdminAuthController } from './admin-auth.controller';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigService } from 'src/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserAuthController } from './user-auth.controller';
import { CompanyUser } from '../company-user/company-user.entity';
import { Company } from '../company/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, CompanyUser]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AdminAuthController, UserAuthController],
  providers: [PasswordService, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
