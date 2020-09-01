import { CompanyUpdateDto } from './company-update.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { APPROVAL_STATUS } from 'src/core';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class AdminCompanyUpdateDto extends CompanyUpdateDto {
  @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  @IsOptional()
  @Expose()
  @IsEnum(APPROVAL_STATUS)
  companyStatus?: APPROVAL_STATUS;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  managerNo?: number;
}
