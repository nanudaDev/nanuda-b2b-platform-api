import { CompanyUserCreateDto } from './company-user-admin-create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { COMPANY_USER, APPROVAL_STATUS } from 'src/core';
import { IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { Default, YN } from 'src/common';

export class AdminCompanyUserCreateDto extends CompanyUserCreateDto {
  constructor() {
    super();
  }

  @ApiProperty({ enum: APPROVAL_STATUS, isArray: true })
  @IsEnum(APPROVAL_STATUS, { each: true })
  @Expose()
  @Default(APPROVAL_STATUS.NEED_APPROVAL)
  companyUserStatus: APPROVAL_STATUS;

  @ApiProperty({ enum: YN })
  @IsEnum(YN)
  @Default(YN.NO)
  @Expose()
  delYn: YN;

  adminNo: number;
}
