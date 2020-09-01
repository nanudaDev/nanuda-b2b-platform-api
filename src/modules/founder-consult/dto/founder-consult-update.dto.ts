import { BaseDto, FOUNDER_CONSULT, B2B_FOUNDER_CONSULT } from 'src/core';
import { FounderConsult } from '../founder-consult.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class FounderConsultUpdateDto extends BaseDto<FounderConsultUpdateDto>
  implements Partial<FounderConsult> {
  @ApiPropertyOptional({ enum: B2B_FOUNDER_CONSULT })
  @IsOptional()
  @IsEnum(B2B_FOUNDER_CONSULT)
  @Expose()
  companyDecisionStatus?: B2B_FOUNDER_CONSULT;
}
