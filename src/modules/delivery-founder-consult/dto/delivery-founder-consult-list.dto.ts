import {
  BaseDto,
  FOUNDER_CONSULT,
  GENDER,
  B2B_FOUNDER_CONSULT,
  FOOD_CATEGORY,
} from 'src/core';
import { DeliveryFounderConsult } from '../delivery-founder-consult.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { AVAILABLE_TIME, YN, ORDER_BY_VALUE, Default } from 'src/common';

export class DeliveryFounderConsultListDto
  extends BaseDto<DeliveryFounderConsultListDto>
  implements Partial<DeliveryFounderConsult> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional({ enum: FOUNDER_CONSULT })
  @IsOptional()
  @IsEnum(FOUNDER_CONSULT)
  @Expose()
  status?: FOUNDER_CONSULT;

  @ApiPropertyOptional({ enum: AVAILABLE_TIME })
  @IsOptional()
  @IsEnum(AVAILABLE_TIME)
  @Expose()
  hopeTime?: AVAILABLE_TIME;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  purposeYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  changUpExpYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  spaceOwnYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

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
  @IsEnum(GENDER)
  @Expose()
  gender?: GENDER;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  created?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeFoodCategory?: string;

  @ApiPropertyOptional({ enum: B2B_FOUNDER_CONSULT })
  @IsOptional()
  @IsEnum(B2B_FOUNDER_CONSULT)
  @Expose()
  companyDecisionStatus?: B2B_FOUNDER_CONSULT;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  viewCount?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyUserNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  endDate?: Date;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo: ORDER_BY_VALUE;
}
