import { BaseDto } from 'src/core';
import { Company } from '../company.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsPhoneNumber,
  IsEmail,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class CompanyUpdateDto extends BaseDto<CompanyUpdateDto>
  implements Partial<Company> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ceoKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ceoEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  fax?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  population?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  businessNo?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @Expose()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  logo?: FileAttachmentDto[];

  companyNo: number;
}
