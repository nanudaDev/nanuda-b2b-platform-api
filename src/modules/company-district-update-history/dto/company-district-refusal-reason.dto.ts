import { CompanyDistrictUpdateRefusalReason } from '../company-district-update-refusal.class';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class CompanyDistrictUpdateRefusalReasonDto
  implements Partial<CompanyDistrictUpdateRefusalReason> {
  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  @IsOptional()
  nameKr?: boolean;

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  @IsOptional()
  nameEng?: boolean;

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  @IsOptional()
  address?: boolean;
}
