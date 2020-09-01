import { BaseDto } from 'src/core';
import { CompanyUpdateRefusalReason } from 'src/modules/company-update-history/company-update-refusal-reason.class';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Expose } from 'class-transformer';
import { CompanyUpdateHistory } from 'src/modules/company-update-history/company-update-history.entity';
import { CompanyUpdateRefusalReasonDto } from 'src/modules/company-update-history/dto/company-update-refusal-reason.dto';

export class AdminCompanyUpdateRefusalDto
  extends BaseDto<AdminCompanyUpdateRefusalDto>
  implements Partial<CompanyUpdateHistory> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  refusalDesc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @ValidateNested({ each: true })
  refusalReasons?: CompanyUpdateRefusalReasonDto;
}
