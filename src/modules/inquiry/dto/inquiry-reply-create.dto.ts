import { BaseDto } from 'src/core';
import { Inquiry } from '../inquiry.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, Default } from 'src/common';

export class InquiryReplyCreateDto extends BaseDto<InquiryReplyCreateDto>
  implements Partial<Inquiry> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  content: string;

  @Expose()
  @Default(YN.YES)
  isInquiryReply: YN.YES;
}
