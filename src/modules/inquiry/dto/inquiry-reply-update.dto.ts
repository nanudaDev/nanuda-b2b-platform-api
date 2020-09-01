import { InquiryReplyCreateDto } from './inquiry-reply-create.dto';
import { Expose } from 'class-transformer';
import { YN, Default } from 'src/common';

export class InquiryReplyUpdateDto extends InquiryReplyCreateDto {
  @Expose()
  @Default(YN.YES)
  isEdited: YN.YES;
}
