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
  @Type(() => Number)
  @Expose()
  size: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @Expose()
  deposit: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @Expose()
  monthlyUtilityFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyRentFee?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  showYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Expose()
  amenityIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Expose()
  deliverySpaceOptionIds?: number[];
}
