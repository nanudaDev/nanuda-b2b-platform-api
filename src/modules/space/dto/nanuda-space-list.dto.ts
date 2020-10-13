import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { Space } from '../space.entity';

export class NanudaSpaceListDto extends BaseDto<NanudaSpaceListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sidoName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sigunguName?: string;
}
