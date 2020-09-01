import { AdminInquiryReplyCreateDto } from './admin-inquiry-reply-create.dto';
import { YN, Default } from 'src/common';
import { Expose } from 'class-transformer';

export class AdminInquiryReplyUpdateDto extends AdminInquiryReplyCreateDto {
  @Default(YN.YES)
  @Expose()
  isEdited: YN.YES;
}
