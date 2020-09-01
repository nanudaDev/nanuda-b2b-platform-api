import { BaseDto } from 'src/core';
import { DeliverySpaceOption } from '../delivery-space-option.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, Default } from 'src/common';

export class AdminDeliverySpaceOptionCreateDto
  extends BaseDto<AdminDeliverySpaceOptionCreateDto>
  implements Partial<DeliverySpaceOption> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  deliverySpaceOptionName: string;

  @ApiProperty()
  @IsNotEmpty()
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
