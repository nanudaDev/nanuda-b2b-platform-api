import { BaseDto, FOUNDER_CONSULT, FOOD_CATEGORY } from 'src/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDate,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { Default, AVAILABLE_TIME, YN } from 'src/common';

export class AdminDeliveryFounderConsultCreateDto extends BaseDto<
  AdminDeliveryFounderConsultCreateDto
> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  nanudaUserNo: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  deliverySpaceNo: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceConsultManager: number;

  @ApiPropertyOptional({ enum: FOUNDER_CONSULT })
  @IsEnum(FOUNDER_CONSULT, { each: true })
  @IsOptional()
  @Default(FOUNDER_CONSULT.F_NEW_REG)
  @Expose()
  status?: FOUNDER_CONSULT;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsDate()
  hopeDate?: Date;

  @ApiPropertyOptional({ enum: AVAILABLE_TIME, isArray: true })
  @IsOptional()
  @Expose()
  @Default(AVAILABLE_TIME.ALL)
  @IsEnum(AVAILABLE_TIME)
  hopeTime?: AVAILABLE_TIME;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  purposeUse?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  changUpExpYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  spaceOwnYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceConsultEtc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeFoodCategory?: FOOD_CATEGORY | string;
}
