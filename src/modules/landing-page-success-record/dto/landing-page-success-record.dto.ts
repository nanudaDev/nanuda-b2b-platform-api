import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { BaseDto } from 'src/core';
import { LandingPageSuccessRecord } from '../landing-page-success-record.entity';

export class LandingPageSuccessRecordDto
  extends BaseDto<LandingPageSuccessRecordDto>
  implements Partial<LandingPageSuccessRecord> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  nonNanudaUserName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요.' })
  nonNanudaUserPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  landingPageName?: string;
}
