import {
  BaseDto,
  FOUNDER_CONSULT,
  GENDER,
  B2B_FOUNDER_CONSULT,
} from 'src/core';
import { DeliveryFounderConsult } from '../delivery-founder-consult.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN } from 'src/common';

export class AdminDeliveryFounderConsultUpdateDto
  extends BaseDto<AdminDeliveryFounderConsultUpdateDto>
  implements Partial<DeliveryFounderConsult> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceConsultManager?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceConsultEtc: string;

  @ApiPropertyOptional({ enum: FOUNDER_CONSULT, isArray: true })
  @IsOptional()
  @Expose()
  @IsEnum(FOUNDER_CONSULT, { each: true })
  status?: FOUNDER_CONSULT;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  purposeYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  changUpExpYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  spaceOwnYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  confirmDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeDate?: Date;

  @ApiPropertyOptional({ enum: GENDER })
  @IsOptional()
  @Expose()
  @IsEnum(GENDER)
  gender?: GENDER;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeFoodCategory?: string;

  @ApiPropertyOptional({ enum: B2B_FOUNDER_CONSULT })
  @IsOptional()
  @Expose()
  @IsEnum(B2B_FOUNDER_CONSULT)
  companyDecisionStatus?: B2B_FOUNDER_CONSULT;
}
