import { BaseDto, COMPANY_USER, APPROVAL_STATUS } from 'src/core';
import { CompanyUser } from '../company-user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsEnum, IsPhoneNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN } from 'src/common';
import * as errors from 'src/locales/kr/errors.json';

export class AdminCompanyUserUpdateDto
  extends BaseDto<AdminCompanyUserUpdateDto>
  implements Partial<CompanyUser> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;

  @ApiPropertyOptional({ enum: COMPANY_USER, isArray: true })
  @IsOptional()
  @IsEnum(COMPANY_USER, { each: true })
  @Expose()
  authCode?: COMPANY_USER;

  @ApiPropertyOptional({ enum: APPROVAL_STATUS, isArray: true })
  @IsOptional()
  @Expose()
  @IsEnum(APPROVAL_STATUS, { each: true })
  companyUserStatus?: APPROVAL_STATUS;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  delYn?: YN;
  //   company user number
  companyUserNo: number;
}
