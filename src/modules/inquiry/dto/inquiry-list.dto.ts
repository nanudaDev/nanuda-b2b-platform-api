import { BaseDto, INQUIRY } from 'src/core';
import { Inquiry } from '../inquiry.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, ORDER_BY_VALUE, Default } from 'src/common';

export class InquiryListDto extends BaseDto<InquiryListDto>
  implements Partial<Inquiry> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  isClosed?: YN;

  @ApiPropertyOptional({ enum: INQUIRY })
  @IsOptional()
  @IsEnum(INQUIRY)
  @Expose()
  inquiryType?: INQUIRY;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyUserName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @IsOptional()
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
