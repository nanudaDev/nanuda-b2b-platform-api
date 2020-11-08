import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';
import { YN, Default } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { Attendees } from '../attendees.entity';

export class AdminAttendeesUpdateDto extends BaseDto<AdminAttendeesUpdateDto>
  implements Partial<Attendees> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요.' })
  @Expose()
  phone?: string;

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

  @ApiPropertyOptional({ enum: GENDER, isArray: true })
  @IsOptional()
  @IsEnum(GENDER, { each: true })
  @Expose()
  gender: GENDER;
}
