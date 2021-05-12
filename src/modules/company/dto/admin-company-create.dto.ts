import { BaseDto, COMPANY, APPROVAL_STATUS } from 'src/core';
import { Company } from '../company.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Default } from 'src/common';
import { type } from 'os';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import * as errors from 'src/locales/kr/errors.json';

export class AdminCompanyCreateDto extends BaseDto<Company>
  implements Partial<Company> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: errors.company.nameKr })
  nameKr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  ceoKr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ceoEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  businessNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  fax?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  population?: string;

  @ApiPropertyOptional({ enum: APPROVAL_STATUS })
  @IsOptional()
  @IsEnum(APPROVAL_STATUS)
  @Expose()
  @Default(APPROVAL_STATUS.NEED_APPROVAL)
  companyStatus?: APPROVAL_STATUS;

  @ApiProperty({ enum: COMPANY })
  @IsEnum(COMPANY)
  @Default(COMPANY.OTHER_COMPANY)
  @Expose()
  companyType: COMPANY;

  adminNo: number;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  logo?: FileAttachmentDto[];
}
