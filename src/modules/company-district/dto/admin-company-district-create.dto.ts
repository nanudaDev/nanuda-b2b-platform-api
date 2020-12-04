import { CompanyDistrictCreateDto } from './company-district-create.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { APPROVAL_STATUS } from 'src/core';
import { IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class AdminCompanyDistrictCreateDto extends CompanyDistrictCreateDto {
  @ApiPropertyOptional({ enum: APPROVAL_STATUS, isArray: true })
  @IsOptional()
  @IsEnum(APPROVAL_STATUS, { each: true })
  @Expose()
  @Default(APPROVAL_STATUS.APPROVAL)
  companyDistrictStatus?: APPROVAL_STATUS;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @Expose()
  // @Default(1000)
  // radius?: number
}
