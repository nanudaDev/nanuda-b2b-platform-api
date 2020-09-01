import {
  BaseDto,
  FOUNDER_CONSULT,
  SPACE_TYPE,
  GENDER,
  B2B_FOUNDER_CONSULT,
} from 'src/core';
import { FounderConsult } from '../founder-consult.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { AVAILABLE_TIME, YN, ORDER_BY_VALUE, Default } from 'src/common';

export class FounderConsultListDto extends BaseDto<FounderConsultListDto>
  implements Partial<FounderConsult> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceNo?: number;

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
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyDistrictNameEng?: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  @IsOptional()
  @Expose()
  spaceTypeNo?: number;

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

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  viewCount?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  created?: string;

  @ApiPropertyOptional({ enum: B2B_FOUNDER_CONSULT })
  @IsOptional()
  @IsEnum(B2B_FOUNDER_CONSULT)
  @Expose()
  companyDecisionStatus?: B2B_FOUNDER_CONSULT;

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
