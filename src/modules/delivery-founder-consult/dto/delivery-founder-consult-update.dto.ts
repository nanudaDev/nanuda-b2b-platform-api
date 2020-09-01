import { BaseDto, B2B_FOUNDER_CONSULT } from 'src/core';
import { DeliveryFounderConsult } from '../delivery-founder-consult.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class DeliveryFounderConsultUpdateDto
  extends BaseDto<DeliveryFounderConsultUpdateDto>
  implements Partial<DeliveryFounderConsult> {
  @ApiPropertyOptional({ enum: B2B_FOUNDER_CONSULT })
  @IsOptional()
  @IsEnum(B2B_FOUNDER_CONSULT)
  @Expose()
  companyDecisionStatus?: B2B_FOUNDER_CONSULT;
}
