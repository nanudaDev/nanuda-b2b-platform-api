import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { DeliveryFounderConsultReply } from '../delivery-founder-consult-reply.entity';
import { DeliveryFounderConsultReplyListDto } from './delivery-founder-consult-reply-list.dto';

export class DeliveryFounderConsultReplyCreateDto
  extends BaseDto<DeliveryFounderConsultReplyCreateDto>
  implements Partial<DeliveryFounderConsultReply> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  desc: string;
}
