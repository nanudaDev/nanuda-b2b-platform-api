import { CompanyUserUpdateRefusalReason } from '../company-user-update-refusal.class';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class CompanyUserUpdateRefusalReasonDto
  implements Partial<CompanyUserUpdateRefusalReason> {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsBoolean()
  name?: boolean;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsBoolean()
  phone?: boolean;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsBoolean()
  workCertificate?: boolean;
}
