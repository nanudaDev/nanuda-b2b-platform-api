import { BaseDto, COMPANY_USER, APPROVAL_STATUS } from '../../../core';
import { CompanyUser } from '../company-user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class CompanyUserListDto extends BaseDto<CompanyUserListDto>
  implements Partial<CompanyUser> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;

  @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  @IsOptional()
  @Expose()
  @IsEnum(APPROVAL_STATUS)
  companyUserStatus?: APPROVAL_STATUS;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
