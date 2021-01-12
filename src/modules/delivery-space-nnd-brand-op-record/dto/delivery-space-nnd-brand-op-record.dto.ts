import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Default, YN } from 'src/common';
import { DeliverySpaceNndBrandOpRecord } from '../delivery-space-nnd-brand-op-record.entity';

export class DeliverySpaceNndBrandOpRecordDto
  implements Partial<DeliverySpaceNndBrandOpRecord> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  brandNo: number;

  @ApiProperty({ enum: YN })
  @IsNotEmpty()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  isOperatedYn: YN;
}
