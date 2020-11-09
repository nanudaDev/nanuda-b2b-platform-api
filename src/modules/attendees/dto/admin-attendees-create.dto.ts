import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { Attendees } from '../attendees.entity';

export class AdminAttendeesCreateDto extends BaseDto<AdminAttendeesCreateDto>
  implements Partial<Attendees> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요.' })
  @Expose()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  eventNo: number;

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
