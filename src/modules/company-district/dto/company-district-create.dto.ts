import { BaseDto, APPROVAL_STATUS } from 'src/core';
import { CompanyDistrict } from '../company-district.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsEnum,
  IsLatLong,
  IsLatitude,
  IsLongitude,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class CompanyDistrictCreateDto extends BaseDto<CompanyDistrictCreateDto>
  implements Partial<CompanyDistrict> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  nameKr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  //   use token for company and parameter for admin
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo: number;

  // @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  // @IsOptional()
  // @IsEnum(APPROVAL_STATUS)
  // @Default(APPROVAL_STATUS.NEED_APPROVAL)
  // @Expose()
  // companyDistrictStatus?: APPROVAL_STATUS;

  @ApiProperty()
  @IsNotEmpty()
  // @IsLatitude()
  @Expose()
  lat: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsLongitude()
  @Expose()
  lon: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  region1DepthName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  region2DepthName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  region3DepthName: string;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  image?: FileAttachmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default(1000)
  radius?: number;
}
