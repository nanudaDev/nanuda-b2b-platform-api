import { BaseDto } from 'src/core';
import { SmsAuth } from '../sms-auth.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserType } from 'src/modules/auth';

export class CompanyUserSmsAuthRegisterDto
  extends BaseDto<CompanyUserSmsAuthRegisterDto>
  implements Partial<SmsAuth> {
  @ApiProperty()
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  @Expose()
  phone: string;

  userType?: UserType;
}
