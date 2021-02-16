import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';

export class CompanyDistrictRevenueRecordUpdateDto extends BaseDto<
  CompanyDistrictRevenueRecordUpdateDto
> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  maxRevenue: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  minRevenue: number;
}
