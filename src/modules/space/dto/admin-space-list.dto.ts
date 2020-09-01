import { SpaceListDto } from './space-list.dto';
import { Space } from '../space.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { YN, Default, ORDER_BY_VALUE } from 'src/common';
import { IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { SPACE } from 'src/core';

export class AdminSpaceListDto extends SpaceListDto implements Partial<Space> {
  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Default(YN.NO)
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @Expose()
  @IsOptional()
  @IsEnum(YN)
  showYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  rentalType?: SPACE.TIME | SPACE.ALL | SPACE.KITCHEN;

  @ApiPropertyOptional({ enum: SPACE })
  @IsOptional()
  @IsEnum(SPACE)
  @Expose()
  status?: SPACE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictCategoryNo?: number;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
