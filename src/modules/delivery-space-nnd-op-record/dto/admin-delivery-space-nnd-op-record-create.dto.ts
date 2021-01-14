import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { DeliverySpaceNndOpRecord } from '../delivery-space-nnd-op-record.entity';

export class AdminDeliverySpaceNndOpRecordCreateDto
  extends BaseDto<AdminDeliverySpaceNndOpRecordCreateDto>
  implements Partial<DeliverySpaceNndOpRecord> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  deliverySpaceNo: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  started?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  ended?: Date;
}
