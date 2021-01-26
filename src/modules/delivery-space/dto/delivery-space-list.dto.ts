import { B2B_EVENT_TYPE, BaseDto } from 'src/core';
import { DeliverySpace } from '../delivery-space.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, ORDER_BY_VALUE, Default } from 'src/common';

export class DeliverySpaceListDto extends BaseDto<DeliverySpaceListDto>
  implements Partial<DeliverySpace> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  typeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  buildingName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsNumber()
  @Type(() => Number)
  size?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;

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
  quantity?: number;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Expose()
  showYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyRentFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyUtilityFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deposit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceOptionName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional({ name: 'amenityIds[]', type: Number, isArray: true })
  @IsOptional()
  @IsArray()
  @Expose()
  amenityIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  promotionNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region1DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region2DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region3DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hCode?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  bCode?: number;

  @ApiPropertyOptional({ enum: B2B_EVENT_TYPE })
  @IsOptional()
  @IsEnum(B2B_EVENT_TYPE)
  @Expose()
  promotionType?: B2B_EVENT_TYPE;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  orderByMonthlyRentFee?: ORDER_BY_VALUE;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  orderByDeposit?: ORDER_BY_VALUE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  minSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  maxSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  minDeposit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  maxDeposit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  minMonthlyRentFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  maxMonthlyRentFee?: number;
}
