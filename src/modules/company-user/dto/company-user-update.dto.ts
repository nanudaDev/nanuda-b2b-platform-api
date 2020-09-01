import { BaseDto } from 'src/core';
import { CompanyUser } from '../company-user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class CompanyUserUpdateDto extends BaseDto<CompanyUserUpdateDto>
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
}
