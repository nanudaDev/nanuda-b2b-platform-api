import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { B2B_EVENT_TYPE, BaseDto } from 'src/core';
import { CompanyDistrictPromotion } from '../company-district-promotion.entity';

export class AdminCompanyDistrictPromotionListDto
  extends BaseDto<CompanyDistrictPromotion>
  implements Partial<CompanyDistrictPromotion> {
  @ApiPropertyOptional({ enum: B2B_EVENT_TYPE, isArray: true })
  @IsOptional()
  @Expose()
  @IsEnum(B2B_EVENT_TYPE)
  promotionType?: B2B_EVENT_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  displayTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNo?: number;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
