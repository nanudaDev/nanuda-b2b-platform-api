import { BaseDto, APPROVAL_STATUS } from 'src/core';
import { CompanyDistrict } from '../company-district.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class CompanyDistrictListDto extends BaseDto<CompanyDistrictListDto>
  implements Partial<CompanyDistrict> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;

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
  address?: string;

  @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  @IsOptional()
  @Expose()
  @IsEnum(APPROVAL_STATUS)
  companyDistrictStatus?: APPROVAL_STATUS;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
