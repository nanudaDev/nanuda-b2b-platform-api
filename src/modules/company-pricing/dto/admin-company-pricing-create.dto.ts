import { BaseDto } from 'src/core';
import { CompanyPricing } from '../company-pricing.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsNumberString } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminCompanyPricingCreateDto
  extends BaseDto<AdminCompanyPricingCreateDto>
  implements Partial<CompanyPricing> {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Expose()
  openFee: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Expose()
  startUpFee: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;
}
