import { BaseDto } from 'src/core';
import { FoodCategory } from '../food-category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class FoodCategoryListDto extends BaseDto<FoodCategoryListDto>
  implements Partial<FoodCategory> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  @IsEnum(ORDER_BY_VALUE)
  orderByNo?: ORDER_BY_VALUE;
}
