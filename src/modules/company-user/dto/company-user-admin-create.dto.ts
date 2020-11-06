import { BaseDto, COMPANY_USER, APPROVAL_STATUS } from 'src/core';
import { CompanyUser } from '../company-user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Min,
  IsEmail,
  IsEnum,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { IsPasswordEqualTo, Default, YN, ORDER_BY_VALUE } from 'src/common';

export class CompanyUserCreateDto extends BaseDto<CompanyUserCreateDto>
  implements Partial<CompanyUser> {
  constructor(partial?: any) {
    super(partial);
  }
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPasswordEqualTo('password')
  @Expose()
  @MinLength(6)
  passwordConfirm: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  companyNo: number;

  @ApiPropertyOptional({ enum: COMPANY_USER, isArray: true })
  @IsOptional()
  @IsEnum(COMPANY_USER, { each: true })
  @Default(COMPANY_USER.NORMAL_COMPANY_USER)
  @Expose()
  authCode?: COMPANY_USER;

  companyAdminNo?: number;
}
