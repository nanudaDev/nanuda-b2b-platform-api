import { BaseDto, STORE_COUNT, BRAND, DIFFICULTY } from 'src/core';
import { Brand } from '../brand.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, Default, ORDER_BY_VALUE } from 'src/common';

export class BrandListDto extends BaseDto<BrandListDto>
  implements Partial<Brand> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  showYn?: YN;

  @ApiPropertyOptional({ enum: STORE_COUNT })
  @IsEnum(STORE_COUNT)
  @IsOptional()
  @Expose()
  storeCount?: STORE_COUNT;

  @ApiPropertyOptional({ enum: BRAND })
  @IsOptional()
  @IsEnum(BRAND)
  @Expose()
  cost?: BRAND;

  @ApiPropertyOptional({ enum: DIFFICULTY })
  @IsOptional()
  @IsEnum(DIFFICULTY)
  @Expose()
  difficulty?: DIFFICULTY;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
