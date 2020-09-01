import { BaseDto, APPROVAL_STATUS } from 'src/core';
import { Company } from '../company.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class AdmiinCompanyListDto extends BaseDto<AdmiinCompanyListDto>
  implements Partial<Company> {
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
  nameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ceoKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ceoEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  population?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  fax?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  @IsOptional()
  @Expose()
  @IsEnum(APPROVAL_STATUS)
  companyStatus?: APPROVAL_STATUS;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  orderByNo?: ORDER_BY_VALUE;
}
