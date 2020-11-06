import { BaseDto } from 'src/core';
import { CompanyUserUpdateHistory } from 'src/modules/company-user-update-history/company-user-update-history.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { CompanyUserUpdateRefusalReasonDto } from 'src/modules/company-user-update-history/dto/company-user-refusal-reason.dto';

export class AdminCompanyUserUpdateRefusalDto
  extends BaseDto<AdminCompanyUserUpdateRefusalDto>
  implements Partial<CompanyUserUpdateHistory> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  refusalDesc?: string;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => CompanyUserUpdateRefusalReasonDto)
  @ValidateNested({ each: true })
  @IsOptional()
  refusalReasons: CompanyUserUpdateRefusalReasonDto;
}
