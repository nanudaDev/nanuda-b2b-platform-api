import { Admin } from '../admin.entity';
import { BaseDto, SPACE_TYPE } from '../../../core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { IsPasswordEqualTo } from '../../../common';
import * as errors from '../../../locales/kr/errors.json';

export class AdminCreateDto extends BaseDto<AdminCreateDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }
  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: errors.name.notEmpty })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  phone: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiProperty()
  @IsPasswordEqualTo('password')
  @Expose()
  passwordConfirm: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  @IsOptional()
  @Expose()
  spaceTypeNo?: SPACE_TYPE;
}
