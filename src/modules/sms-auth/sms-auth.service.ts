require('dotenv').config();
import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { SmsAuth } from './sms-auth.entity';
import { Repository } from 'typeorm';
import {
  CompanyUserSmsAuthRegisterDto,
  CompanyUserSmsAuthCheckDto,
  AdminSendMessageDto,
} from './dto';
import { CompanyUserService } from '../company-user/company-user.service';
import { UserType } from '../auth';
import { ENVIRONMENT } from '../../config';
import { SmsNotificationService } from 'src/core/utils';
import { Request } from 'express';
import { CompanyUserPhoneDto } from '../auth/dto';

@Injectable()
export class SmsAuthService extends BaseService {
  constructor(
    @InjectRepository(SmsAuth)
    private readonly smsAuthRepo: Repository<SmsAuth>,
    private readonly companyUserService: CompanyUserService,
    private readonly smsNotificationService: SmsNotificationService,
  ) {
    super();
  }

  /**
   * check code
   * @param companyUserSmsAuthCheckDto
   */
  async registerCode(
    companyUserSmsAuthRegisterDto: CompanyUserSmsAuthRegisterDto,
    req?: Request,
  ) {
    const dto = new CompanyUserPhoneDto();
    if (
      companyUserSmsAuthRegisterDto.phone &&
      companyUserSmsAuthRegisterDto.phone.includes('-')
    ) {
      companyUserSmsAuthRegisterDto.phone = companyUserSmsAuthRegisterDto.phone.replace(
        /-/g,
        '',
      );
    }
    dto.phone = companyUserSmsAuthRegisterDto.phone;
    const findUser = await this.companyUserService.findByPhone(dto);
    if (!findUser) {
      throw new BadRequestException({
        message:
          '존재하지 않는 사용자입니다. 관리자에게 문의해주시길 바랍니다.',
        error: 404,
      });
    }
    let smsAuth = new SmsAuth();
    const newAuthCode = Math.floor(100000 + Math.random() * 900000);
    smsAuth.phone = companyUserSmsAuthRegisterDto.phone;
    smsAuth.authCode = newAuthCode;
    smsAuth.userType = UserType.COMPANY_USER;
    if (process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT) {
      console.log(smsAuth.authCode);
    }
    smsAuth = await this.smsAuthRepo.save(smsAuth);
    await this.smsNotificationService.sendLoginPrompt(req, newAuthCode);
    return true;
  }

  /**
   * check
   * @param companyUserSmsAuthCheckDto
   */
  async checkCode(companyUserSmsAuthCheckDto: CompanyUserSmsAuthCheckDto) {
    companyUserSmsAuthCheckDto.userType = UserType.COMPANY_USER;
    if (
      companyUserSmsAuthCheckDto.phone &&
      companyUserSmsAuthCheckDto.phone.includes('-')
    ) {
      companyUserSmsAuthCheckDto.phone = companyUserSmsAuthCheckDto.phone.replace(
        /-/g,
        '',
      );
    }
    const check = await this.smsAuthRepo.findOne(companyUserSmsAuthCheckDto);
    if (!check) {
      throw new BadRequestException({
        message: '인증번호가 정확하지 않습니다.',
      });
    }
    // delete auth key
    await this.smsAuthRepo
      .createQueryBuilder()
      .delete()
      .from(SmsAuth)
      .where('no = :no', { no: check.no })
      .execute();

    return true;
  }

  async sendAdminMessage(
    adminSendMessageDto: AdminSendMessageDto,
    req?: Request,
  ) {
    console.log(adminSendMessageDto);
    return await this.smsNotificationService.sendAdminMessage(
      adminSendMessageDto,
      req,
    );
  }
}
