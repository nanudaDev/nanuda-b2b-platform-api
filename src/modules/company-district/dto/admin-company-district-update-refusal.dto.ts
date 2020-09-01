import { BaseDto } from 'src/core';
import { CompanyDistrictUpdateHistory } from 'src/modules/company-district-update-history/company-district-update-history.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Expose } from 'class-transformer';
import { CompanyUpdateRefusalReason } from 'src/modules/company-update-history/company-update-refusal-reason.class';
import { CompanyDistrictUpdateRefusalReasonDto } from 'src/modules/company-district-update-history/dto';

export class AdminCompanyDistrictUpdateRefusalDto
  extends BaseDto<AdminCompanyDistrictUpdateRefusalDto>
  implements Partial<CompanyDistrictUpdateHistory> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  refusalDesc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Expose()
  refusalReasons?: CompanyDistrictUpdateRefusalReasonDto;
}
