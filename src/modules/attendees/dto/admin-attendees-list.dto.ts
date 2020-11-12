import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { Default, ORDER_BY_VALUE, YN } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { Attendees } from '../attendees.entity';

export class AdminAttendeesListDto extends BaseDto<AdminAttendeesListDto>
  implements Partial<Attendees> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  //   @IsPhoneNumber('KR')
  phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  eventNo: number;

  @ApiPropertyOptional({ enum: GENDER, isArray: true })
  @IsEnum(GENDER, { each: true })
  @IsOptional()
  @Expose()
  gender?: GENDER;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN, { each: true })
  @IsOptional()
  @Expose()
  isAttended?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN, { each: true })
  @IsOptional()
  @Expose()
  isContracted?: YN;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  @IsOptional()
  orderByNo?: ORDER_BY_VALUE;
}
