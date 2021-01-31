import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto, KbFoodCategory } from 'src/core';
import { TrackTraceToSpaceCategory } from 'src/modules/track-trace-space-to-category/track-trace-space-to-category.entity';

export class NanudaCreateTrackDto extends BaseDto<NanudaCreateTrackDto>
  implements Partial<TrackTraceToSpaceCategory> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  guName: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  isSkippedYn?: YN;

  @ApiPropertyOptional({ enum: KbFoodCategory })
  @IsOptional()
  @Expose()
  @IsEnum(KbFoodCategory)
  kbFoodCategory?: KbFoodCategory;
}
