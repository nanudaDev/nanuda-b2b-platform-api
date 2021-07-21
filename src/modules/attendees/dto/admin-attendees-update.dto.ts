import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';
import { YN, Default } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { Attendees } from '../attendees.entity';
import * as errors from 'src/locales/kr/errors.json';

export class AdminAttendeesUpdateDto extends BaseDto<AdminAttendeesUpdateDto>
  implements Partial<Attendees> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  scheduleTime?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN, { each: true })
  @Expose()
  @Default(YN.NO)
  isAttended?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN, { each: true })
  @Expose()
  @Default(YN.NO)
  isContracted?: YN;

  @ApiPropertyOptional({ enum: GENDER })
  @IsOptional()
  @IsEnum(GENDER, { each: true })
  @Expose()
  gender: GENDER;
}
