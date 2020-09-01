import { CompanyUserSmsAuthRegisterDto } from './company-user-sms-auth-register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CompanyUserSmsAuthCheckDto extends CompanyUserSmsAuthRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  authCode: number;
}
