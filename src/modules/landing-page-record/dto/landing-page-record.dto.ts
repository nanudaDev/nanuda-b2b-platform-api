import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AdvType, Default } from 'src/common';
import { BaseDto } from 'src/core';

export class LandingPageRecordDto extends BaseDto<LandingPageRecordDto> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  landingPageName: string;

  @ApiPropertyOptional({ enum: AdvType })
  @IsOptional()
  @Expose()
  @IsEnum(AdvType)
  @Default(AdvType.NONE)
  advType?: AdvType;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  ip?: string;
}
