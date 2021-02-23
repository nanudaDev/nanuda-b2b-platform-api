import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';

export class CompanyDistrictRevenueRecordUpdateDto extends BaseDto<
  CompanyDistrictRevenueRecordUpdateDto
> {
  @ApiProperty()
  @Expose()
  @MaxLength(11, { message: '11자리까지만 가능합니다' })
  @IsNumberString({ message: '숫자만 입력가능합니다' })
  @IsNotEmpty({ message: '최고 매출은 필수값 입니다' })
  maxRevenue: number;

  @ApiProperty()
  @Expose()
  @MaxLength(11, { message: '11자리까지만 가능합니다' })
  @IsNumberString({ message: '숫자만 입력가능합니다' })
  @IsNotEmpty({ message: '최저 매출은 필수값 입니다' })
  minRevenue: number;
}
