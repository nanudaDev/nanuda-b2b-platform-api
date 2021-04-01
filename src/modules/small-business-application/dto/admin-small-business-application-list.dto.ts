import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { Default, ORDER_BY_VALUE, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { SmallBusinessApplication } from '../small-business-application.entity';

export class AdminSmallBusinessApplicationListDto
  extends BaseDto<AdminSmallBusinessApplicationListDto>
  implements Partial<SmallBusinessApplication> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @Expose()
  @IsOptional()
  isSavedYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @Expose()
  @IsOptional()
  isCompleteYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  email?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
