import {
  BaseDto,
  FOUNDER_CONSULT,
  SPACE_TYPE,
  GENDER,
  B2B_FOUNDER_CONSULT,
} from 'src/core';
import { FounderConsult } from '../founder-consult.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsEmail, IsIP } from 'class-validator';
import { Expose } from 'class-transformer';
import { AVAILABLE_TIME, YN, Default, ORDER_BY_VALUE } from 'src/common';

export class AdminFounderConsultListDto
  extends BaseDto<AdminFounderConsultListDto>
  implements Partial<FounderConsult> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceNo?: number;

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
  companyNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNameEng?: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  @IsOptional()
  @Expose()
  spaceTypeNo?: SPACE_TYPE;

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
  adminNo?: number;

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
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ended?: Date;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
