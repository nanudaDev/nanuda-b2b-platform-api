import { BaseDto, APPROVAL_STATUS } from 'src/core';
import { CompanyDistrict } from '../company-district.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';
import { CompanyDistrictListDto } from './company-district.list.dto';

export class AdminCompanyDistrictListDto extends CompanyDistrictListDto {
  constructor(partial?: any) {
    super(partial);
  }

  // @ApiPropertyOptional()
  // @IsOptional()
  // @Expose()
  // no?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNameEng?: string;
}
