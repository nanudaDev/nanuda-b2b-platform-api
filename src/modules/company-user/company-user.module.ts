import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from './company-user.entity';
import { Admin } from '../admin';
import { CompanyUserService } from './company-user.service';
import { PasswordService } from '../auth';
import { AdminCompanyUserController } from './admin-company-user.controller';
import { CompanyUserController } from './company-user.controller';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { NanudaSlackNotificationService } from 'src/core/utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyUser, CompanyUserUpdateHistory, Admin]),
  ],
  controllers: [AdminCompanyUserController, CompanyUserController],
  providers: [
    CompanyUserService,
    PasswordService,
    NanudaSlackNotificationService,
  ],
  exports: [CompanyUserService],
})
export class CompanyUserModule {}
