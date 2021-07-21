import { BaseDto } from 'src/core';
import { SmsAuth } from '../sms-auth.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserType } from 'src/modules/auth';
import * as errors from 'src/locales/kr/errors.json';
export class CompanyUserSmsAuthRegisterDto
  extends BaseDto<CompanyUserSmsAuthRegisterDto>
  implements Partial<SmsAuth> {
  @ApiProperty()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  @IsNotEmpty({ message: errors.phone.isNotEmpty })
  @Expose()
  phone: string;

  userType?: UserType;
}
