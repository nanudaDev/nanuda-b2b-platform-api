import { BaseDto, AMENITY, SPACE_TYPE } from 'src/core';
import { Part } from 'aws-sdk/clients/s3';
import { Amenity } from '../amenity.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

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
  spaceTypeNo?: SPACE_TYPE;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @Expose()
  image?: FileAttachmentDto[];
}
