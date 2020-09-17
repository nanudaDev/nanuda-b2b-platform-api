import { BaseDto, FOOD_CATEGORY } from 'src/core';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { AVAILABLE_TIME, Default, YN } from 'src/common';

export class NanudaDeliveryFounderConsultCreateDto extends BaseDto<
  NanudaDeliveryFounderConsultCreateDto
> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  nanudaUserNo?: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  deliverySpaceNo?: number;

  @ApiPropertyOptional({ enum: FOOD_CATEGORY })
  @IsOptional()
  @Expose()
  @IsEnum(FOOD_CATEGORY)
  hopeFoodCategory?: FOOD_CATEGORY;

  @ApiPropertyOptional({ enum: AVAILABLE_TIME })
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
  changUpExpYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  spaceOwnYn?: YN;
}
