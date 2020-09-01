import { BaseDto } from 'src/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminCompanyPricingUpdateDto extends BaseDto<
  AdminCompanyPricingUpdateDto
> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsNumberString()
  openFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  startUpFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  parentNo?: number;
}
