import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';

export class AdminBrandKioskMapperDto extends BaseDto<
  AdminBrandKioskMapperDto
> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ended?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  brandNo: number;
}
