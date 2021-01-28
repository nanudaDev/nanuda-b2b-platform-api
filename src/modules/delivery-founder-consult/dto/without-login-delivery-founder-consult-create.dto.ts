import { BaseDto } from 'src/core';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { AVAILABLE_TIME, Default } from 'src/common';

export class WithoutLoginDeliveryFounderConsultCreateDto extends BaseDto<
  WithoutLoginDeliveryFounderConsultCreateDto
> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @Expose()
  @IsArray()
  deliverySpaceNos?: number[];

  @ApiPropertyOptional({ enum: AVAILABLE_TIME })
  @IsOptional()
  @Expose()
  @Default(AVAILABLE_TIME.ALL)
  @IsEnum(AVAILABLE_TIME)
  hopeTime?: AVAILABLE_TIME;

  nanudaUserNo?: number;
}
