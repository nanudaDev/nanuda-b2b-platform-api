import { BaseDto } from 'src/core';
import { DeliverySpace } from '../delivery-space.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumberString,
  IsEnum,
  IsNumber,
  IsIP,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, ORDER_BY_VALUE, Default } from 'src/common';

export class DeliverySpaceListDto extends BaseDto<DeliverySpaceListDto>
  implements Partial<DeliverySpace> {
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
  monthlyRentFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deposit?: string;

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

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
