import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';
import { ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';

export class CompanyDistrictRevenueRecordUpdateDto extends BaseDto<
  CompanyDistrictRevenueRecordUpdateDto
> {
  @ApiProperty()
  @Expose()
  revenueNo: number;

  @ApiProperty()
  @Expose()
  maxRevenue: number;

  @ApiProperty()
  @Expose()
  minRevenue: number;
}
