import { CompanyDistrictUpdateDto } from './company-district-update.dto';
import { APPROVAL_STATUS } from 'src/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { Default } from 'src/common';

export class AdminCompanyDistrictUpdateDto extends CompanyDistrictUpdateDto {
  @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  @IsOptional()
  @IsEnum(APPROVAL_STATUS)
  @Expose()
  companyDistrictStatus?: APPROVAL_STATUS;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default(1000)
  radius?: number;

  @ApiPropertyOptional({ name: 'promotionIds[]', type: Number, isArray: true })
  @IsOptional()
  @Expose()
  @IsArray()
  promotionNos?: number[];

  @ApiPropertyOptional({ name: 'amenityIds[]', type: Number, isArray: true })
  @IsOptional()
  @Expose()
  @IsArray()
  amenityIds?: number[];
}
