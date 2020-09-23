import { BaseDto } from 'src/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default, YN } from 'src/common';

export class NanudaArticleListDto extends BaseDto<NanudaArticleListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediaName?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  aboutUsYn?: YN;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
