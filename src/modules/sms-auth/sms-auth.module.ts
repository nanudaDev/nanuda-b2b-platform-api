import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsAuth } from './sms-auth.entity';
import { SmsAuthService } from './sms-auth.service';
import { SmsAuthController } from './sms-auth.controller';
import { CompanyUserService } from '../company-user/company-user.service';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { PasswordService } from '../auth';
import {
  NanudaSlackNotificationService,
  NanudaSmsNotificationService,
  SmsNotificationService,
} from 'src/core/utils';
import { AdminSmsController } from './admin-sms-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsAuth, CompanyUser, CompanyUserUpdateHistory]),
  ],
  controllers: [AdminSmsController, SmsAuthController],
  providers: [
    SmsAuthService,
    CompanyUserService,
    PasswordService,
    NanudaSlackNotificationService,
    SmsNotificationService,
    NanudaSmsNotificationService,
  ],
  exports: [NanudaSmsNotificationService, SmsNotificationService],
})
export class SmsAuthModule {}
