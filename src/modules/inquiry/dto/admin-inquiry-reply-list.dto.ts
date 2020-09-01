import { BaseDto } from 'src/core';
import { Inquiry } from '../inquiry.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, ORDER_BY_VALUE, Default } from 'src/common';

export class AdminInquiryReplyListDto extends BaseDto<AdminInquiryReplyListDto>
  implements Partial<Inquiry> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;

  isInquiryReply: YN.YES;
}
