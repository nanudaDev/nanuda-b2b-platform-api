import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { YN } from 'src/common';
import { BaseDto } from 'src/core';
import { TrackTraceToSpaceCategory } from 'src/modules/track-trace-space-to-category/track-trace-space-to-category.entity';

export class NanudaCreateTrackDto extends BaseDto<NanudaCreateTrackDto>
  implements Partial<TrackTraceToSpaceCategory> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  hdongName: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  isSkippedYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  kbFoodCategory?: string;
}
