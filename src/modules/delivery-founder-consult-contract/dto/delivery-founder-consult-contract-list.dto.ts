import { BaseDto, FOOD_CATEGORY } from 'src/core';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class DeliveryFounderConsultContractListDto extends BaseDto<
  DeliveryFounderConsultContractListDto
> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceTypeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeFoodCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceOptionsName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  @IsEnum(ORDER_BY_VALUE)
  orderByNo?: ORDER_BY_VALUE;
}
