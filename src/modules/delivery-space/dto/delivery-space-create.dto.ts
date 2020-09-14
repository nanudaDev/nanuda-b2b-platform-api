import { BaseDto } from 'src/core';
import { DeliverySpace } from '../delivery-space.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto/file-upload.dto';

export class DeliverySpaceCreateDto extends BaseDto<DeliverySpaceCreateDto>
  implements Partial<DeliverySpace> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  typeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  buildingName?: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Expose()
  size: number;

  @ApiProperty()
  @IsNumberString()
  @Expose()
  deposit: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @Expose()
  monthlyUtilityFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyRentFee?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  showYn?: YN;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Expose()
  images?: FileAttachmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Expose()
  amenityIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Expose()
  deliverySpaceOptionIds?: number[];

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  companyDistrictNo: number;
}
