import { BaseDto } from 'src/core';
import { DeliverySpaceOption } from '../delivery-space-option.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, Default } from 'src/common';

export class AdminDeliverySpaceOptionUpdateeDto
  extends BaseDto<AdminDeliverySpaceOptionUpdateeDto>
  implements Partial<DeliverySpaceOption> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceOptionName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliverySpaceOptionCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Default(YN.YES)
  @Expose()
  showYn?: YN;

  adminNo?: number;
}
