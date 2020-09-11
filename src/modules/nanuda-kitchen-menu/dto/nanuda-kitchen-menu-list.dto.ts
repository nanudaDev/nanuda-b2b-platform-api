import { BaseDto } from 'src/core';
import { NanudaKitchenMenu } from '../nanuda-kitchen-menu.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class NanudaKitchenMenuListDto extends BaseDto<NanudaKitchenMenuListDto>
  implements Partial<NanudaKitchenMenu> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  menuName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  menuPrice?: number;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByMenuNo?: ORDER_BY_VALUE;
}
