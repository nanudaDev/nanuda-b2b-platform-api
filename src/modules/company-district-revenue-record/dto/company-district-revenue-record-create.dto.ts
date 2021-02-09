import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { CompanyDistrictRevenueRecord } from '../company-district-revenue-record.entity';

export class CompanyDistrictRevenueRecordCreateDto
  extends BaseDto<CompanyDistrictRevenueRecordCreateDto>
  implements Partial<CompanyDistrictRevenueRecord> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  companyDistrictNo: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  year: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  month: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  maxRevenue: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  minRevenue: number;
}
