import { BaseDto, INQUIRY } from 'src/core';
import { Inquiry } from '../inquiry.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default, YN } from 'src/common';

export class AdminInquiryListDto extends BaseDto<AdminInquiryListDto>
  implements Partial<Inquiry> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyName?: string;

  @ApiPropertyOptional({ enum: INQUIRY })
  @IsOptional()
  @IsEnum(INQUIRY)
  @Expose()
  inquiryType?: INQUIRY;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  isClosed?: YN;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
