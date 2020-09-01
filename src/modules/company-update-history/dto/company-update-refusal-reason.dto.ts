import { CompanyUpdateRefusalReason } from '../company-update-refusal-reason.class';
import { BaseDto } from 'src/core';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CompanyUpdateRefusalReasonDto
  extends BaseDto<CompanyUpdateRefusalReasonDto>
  implements Partial<CompanyUpdateRefusalReason> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  logo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  email?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ceoKr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ceoEng?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  website?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  fax?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  population?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  businessNo?: boolean;
}
