import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPort,
} from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { SmallBusinessApplication } from '../small-business-application.entity';
import * as errors from 'src/locales/kr/errors.json';

export class SmallBusinessApplicationListDto
  extends BaseDto<SmallBusinessApplicationListDto>
  implements Partial<SmallBusinessApplication> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  phone: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
