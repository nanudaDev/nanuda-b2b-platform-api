import { BaseDto } from 'src/core';
import { BrandListDto } from './brand-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { YN, Default } from 'src/common';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminBrandListDto extends BrandListDto {
  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  delYn?: YN;
}
