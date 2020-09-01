import { BaseDto } from 'src/core';
import { Inquiry } from '../inquiry.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { ORDER_BY_VALUE, Default } from 'src/common';
import { Expose } from 'class-transformer';

export class InquiryReplyListDto extends BaseDto<InquiryReplyListDto> {
  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
