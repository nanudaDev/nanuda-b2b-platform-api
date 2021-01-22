import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIP, IsOptional, MinLength } from 'class-validator';
import { BaseDto } from 'src/core';
import { AttendeesOnline } from '../attendees-online.entity';
import { SecondMeetingApplicant } from '../second-meeting-applicant.entity';

export class NanudaSecondMeetingApplyDto
  extends BaseDto<NanudaSecondMeetingApplyDto>
  implements Partial<SecondMeetingApplicant> {
  @ApiProperty()
  @IsOptional()
  @Expose()
  name: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  @MinLength(11)
  phone?: string;

  @ApiPropertyOptional()
  @IsIP()
  @IsOptional()
  @Expose()
  requestIp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeArea?: string;
}
