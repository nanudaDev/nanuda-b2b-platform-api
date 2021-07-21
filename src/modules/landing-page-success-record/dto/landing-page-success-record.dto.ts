import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { BaseDto } from 'src/core';
import { LandingPageSuccessRecord } from '../landing-page-success-record.entity';
import * as errors from 'src/locales/kr/errors.json';

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
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  nonNanudaUserPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  landingPageName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeArea?: string;
}
