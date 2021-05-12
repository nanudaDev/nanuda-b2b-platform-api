import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { YN } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { NanudaUser } from '../nanuda-user.entity';
import * as errors from '../../../locales/kr/errors.json';

export class AdminNanudaUserCreateDto extends BaseDto<AdminNanudaUserCreateDto>
  implements Partial<NanudaUser> {
  @ApiProperty()
  @IsNotEmpty({ message: errors.name.notEmpty })
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: errors.phone.notEmpty })
  @Expose()
  @IsPhoneNumber('KR', { message: '올바른 전화번호를 입력해주세요.' })
  phone: string;

  @ApiPropertyOptional({ enum: GENDER })
  @IsOptional()
  @IsEnum(GENDER)
  @Expose()
  gender?: GENDER;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  marketYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  serviceYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  infoYn?: YN;
}
