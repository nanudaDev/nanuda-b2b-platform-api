import { BaseDto } from 'src/core';
import { Inquiry } from '../inquiry.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN } from 'src/common';

export class AdminInquiryReplyCreateDto
  extends BaseDto<AdminInquiryReplyCreateDto>
  implements Partial<Inquiry> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  content?: string;

  isInquiryReply: YN.YES;
}
