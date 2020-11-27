import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { B2B_EVENT_TYPE, BaseDto } from 'src/core';
import { CompanyDistrictPromotion } from '../company-district-promotion.entity';

export class CompanyDistrictPromotionListDto
  extends BaseDto<CompanyDistrictPromotion>
  implements Partial<CompanyDistrictPromotion> {
  @ApiPropertyOptional({ enum: B2B_EVENT_TYPE, isArray: true })
  @IsOptional()
  @Expose()
  w;
  promotionType?: B2B_EVENT_TYPE;
}
