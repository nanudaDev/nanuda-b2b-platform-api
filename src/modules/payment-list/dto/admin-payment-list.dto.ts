import { BaseDto } from 'src/core';
import { PaymentList } from '../payment-list.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDate } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class AdminPaymentListDto extends BaseDto<AdminPaymentListDto>
  implements Partial<PaymentList> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  shopName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  businessNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  totalAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  paymentListNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaKitchenMasterName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByPaymentListNo?: ORDER_BY_VALUE;
}
