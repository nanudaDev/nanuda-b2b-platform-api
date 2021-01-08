import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';
import { DeliveryFounderConsultReply } from '../delivery-founder-consult-reply.entity';

export class AdminDeliveryFounderConsultReplyCreateDto
  extends BaseDto<AdminDeliveryFounderConsultReplyCreateDto>
  implements Partial<DeliveryFounderConsultReply> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  desc: string;
}
