import { BaseDto, AMENITY } from 'src/core';
import { Amenity } from '../amenity.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class AmenityListDto extends BaseDto<AmenityListDto>
  implements Partial<Amenity> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityCode?: string;

  @ApiPropertyOptional({ enum: AMENITY })
  @IsOptional()
  @IsEnum(AMENITY, { each: true })
  @Expose()
  amenityType?: AMENITY;
}
