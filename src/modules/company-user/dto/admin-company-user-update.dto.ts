import { BaseDto, COMPANY_USER, APPROVAL_STATUS } from 'src/core';
import { CompanyUser } from '../company-user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsEnum, IsPhoneNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN } from 'src/common';

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
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;

  @ApiPropertyOptional({ enum: COMPANY_USER })
  @IsOptional()
  @IsEnum(COMPANY_USER)
  @Expose()
  authCode?: COMPANY_USER;

  @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  @IsOptional()
  @Expose()
  companyUserStatus?: APPROVAL_STATUS;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  delYn?: YN;
  //   company user number
  companyUserNo: number;
}
