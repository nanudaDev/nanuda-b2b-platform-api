import { BaseDto } from 'src/core';
import { DeliverySpace } from '../delivery-space.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsEnum, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, Default } from 'src/common';

export class DeliverySpaceUpdateDto extends BaseDto<DeliverySpaceUpdateDto>
  implements Partial<DeliverySpace> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  typeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  buildingName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  size: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deposit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyUtilityFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyRentFee?: number;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  showYn?: YN;

  @ApiPropertyOptional({ isArray: true })
  @IsOptional()
  @IsArray()
  @Expose()
  amenityIds?: number[];

  @ApiPropertyOptional({ isArray: true })
  @IsOptional()
  @IsArray()
  @Expose()
  deliverySpaceOptionIds?: number[];
}
