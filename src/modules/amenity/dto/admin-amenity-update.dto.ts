import { BaseDto, AMENITY } from 'src/core';
import { Part } from 'aws-sdk/clients/s3';
import { Amenity } from '../amenity.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminAmenityUpdateDto extends BaseDto<AdminAmenityUpdateDto>
  implements Partial<Amenity> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityCode?: string;

  @ApiProperty({ enum: AMENITY })
  @IsNotEmpty()
  @IsEnum(AMENITY)
  @Expose()
  amenityType: AMENITY;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceTypeNo?: 0 | 1 | 2;
}
