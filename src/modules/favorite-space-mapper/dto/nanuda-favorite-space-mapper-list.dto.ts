import { BaseDto } from 'src/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsEnum } from 'class-validator';
import { ORDER_BY_VALUE, Default } from 'src/common';
import { Expose } from 'class-transformer';

export class NanudaFavoriteSpaceMapperListDto extends BaseDto<
  NanudaFavoriteSpaceMapperListDto
> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserNo?: number;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;

  //   @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  //   @IsOptional()
  //   @IsEnum(ORDER_BY_VALUE)
  //   @Default(ORDER_BY_VALUE.DESC)
  //   @Expose()
  //   orderBySize?: ORDER_BY_VALUE;
}
