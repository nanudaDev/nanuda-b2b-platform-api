import { BaseDto } from 'src/core';
import { CompanyPricing } from '../company-pricing.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class AdminCompanyPricingListDto
  extends BaseDto<AdminCompanyPricingListDto>
  implements Partial<CompanyPricing> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  openFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  startUpFee?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
