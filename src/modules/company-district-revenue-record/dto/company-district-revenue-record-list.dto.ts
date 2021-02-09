import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { CompanyDistrictRevenueRecord } from '../company-district-revenue-record.entity';

export class CompanyDistrictRevenueRecordListDto
  extends BaseDto<CompanyDistrictRevenueRecordListDto>
  implements Partial<CompanyDistrictRevenueRecord> {
  //     @ApiProperty()
  //   @IsNumberString()
  //   @Expose()
  //   district_no:number
  //   @ApiProperty()
  @ApiProperty()
  @IsOptional()
  @Expose()
  companyDistrictName: string;

  @IsOptional()
  @Expose()
  companyDistrictNo: number;
  @ApiProperty()
  @IsOptional()
  @Expose()
  maxYear?: number;

  @ApiProperty()
  @IsOptional()
  @Expose()
  min_year?: number;

  @ApiProperty()
  @IsOptional()
  @Expose()
  max_month?: number;

  @ApiProperty()
  @IsOptional()
  @Expose()
  min_month?: number;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderby: ORDER_BY_VALUE;
}
