import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDto } from 'src/core';

export class NanudaFavoriteSpaceMapperDeleteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Expose()
  favoriteSpaceNos?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserNo?: string | number;
}
