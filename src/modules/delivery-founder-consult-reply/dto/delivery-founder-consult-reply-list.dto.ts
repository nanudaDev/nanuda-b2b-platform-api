import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { DeliveryFounderConsultReply } from '../delivery-founder-consult-reply.entity';

export class DeliveryFounderConsultReplyListDto
  extends BaseDto<DeliveryFounderConsultReplyListDto>
  implements Partial<DeliveryFounderConsultReply> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyUserNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliveryFounderConsultNo?: number;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
