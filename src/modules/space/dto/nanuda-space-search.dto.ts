import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';

export class NanudaSpaceSearchDto extends BaseDto<NanudaSpaceSearchDto> {
  @ApiPropertyOptional({ name: 'amenityIds[]', type: Number, isArray: true })
  @IsOptional()
  @Expose()
  @IsArray()
  amenityIds?: number[];

  @ApiPropertyOptional({ name: 'brandIds[]', type: Number, isArray: true })
  @IsOptional()
  @Expose()
  @IsArray()
  brandIds?: number[];
}
