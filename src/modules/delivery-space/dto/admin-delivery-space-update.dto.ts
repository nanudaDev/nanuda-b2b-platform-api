import { BaseDto } from 'src/core';
import { DeliverySpace } from '../delivery-space.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsNumberString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { DeliverySpaceUpdateDto } from './delivery-space-update.dto';

export class AdminDeliverySpaceUpdateDto extends DeliverySpaceUpdateDto {
  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Expose()
  images?: FileAttachmentDto[];

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Expose()
  newImages?: FileAttachmentDto[];

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  companyDistrictNo: number;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Default(YN.NO)
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsArray()
  brandIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;
}
