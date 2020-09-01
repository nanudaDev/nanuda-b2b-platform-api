import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { BaseController } from 'src/core';
import {
  CompanyUserSmsAuthRegisterDto,
  CompanyUserSmsAuthCheckDto,
} from './dto';
import { SmsAuthService } from './sms-auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller()
@ApiTags('SMS AUTH')
export class SmsAuthController extends BaseController {
  constructor(private readonly smsAuthService: SmsAuthService) {
    super();
  }

  /**
   * company user register sms auth code.
   * @param companyUserSmsAuthCheckDto
   */
  @Post('/register-sms-code')
  async registerCode(
    @Body() companyUserSmsAuthRegisterDto: CompanyUserSmsAuthRegisterDto,
    @Req() req: Request,
  ) {
    return await this.smsAuthService.registerCode(
      companyUserSmsAuthRegisterDto,
      req,
    );
  }

  /**
   * check code
   * @param companyUserSmsAuthCheckDto
   */
  @Post('/check-sms-code')
  async checkCode(
    @Body() companyUserSmsAuthCheckDto: CompanyUserSmsAuthCheckDto,
  ) {
    return await this.smsAuthService.checkCode(companyUserSmsAuthCheckDto);
  }
}
