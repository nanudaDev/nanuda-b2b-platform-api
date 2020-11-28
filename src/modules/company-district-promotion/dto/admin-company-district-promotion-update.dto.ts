import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { YN, Default } from 'src/common';
import { B2B_EVENT_TYPE, BaseDto } from 'src/core';
import { CompanyDistrictPromotion } from '../company-district-promotion.entity';

export class AdminCompanyDistrictPromotionUpdateDto
  extends BaseDto<AdminCompanyDistrictPromotionUpdateDto>
  implements Partial<CompanyDistrictPromotion> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  displayTitle?: string;

  @ApiPropertyOptional({ enum: B2B_EVENT_TYPE })
  @IsOptional()
  @Expose()
  @IsEnum(B2B_EVENT_TYPE)
  promotionType?: B2B_EVENT_TYPE;

  //   @ApiPropertyOptional({ type: 'date' })
  //   @IsOptional()
  //   @IsDate()
  //   @Expose()
  //   started?: Date;

  @ApiPropertyOptional({ type: 'date' })
  @IsOptional()
  @IsDate()
  @Expose()
  ended?: Date;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  showYn?: YN;
}
