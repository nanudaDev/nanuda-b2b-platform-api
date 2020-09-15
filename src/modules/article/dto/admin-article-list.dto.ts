import { BaseDto } from 'src/core';
import { Article } from '../article.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default, YN } from 'src/common';

export class AdminArticleListDto extends BaseDto<AdminArticleListDto>
  implements Partial<Article> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediaName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  showYn?: YN;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
