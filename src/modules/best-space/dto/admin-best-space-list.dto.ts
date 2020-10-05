import { BaseDto } from 'src/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default, YN } from 'src/common';

export class AdminBestSpaceListDto extends BaseDto<AdminBestSpaceListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceTypeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceDeposit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNameKr?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  showYn?: YN;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
