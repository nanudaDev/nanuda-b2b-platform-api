import { BaseDto, SPACE_TYPE } from '../../../core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Admin } from '../admin.entity';
import { IsPasswordEqualTo } from 'src/common';

export class AdminUpdateDto extends BaseDto<AdminUpdateDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsPhoneNumber('KR')
  phone?: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  @IsOptional()
  @Expose()
  spaceTypeNo?: SPACE_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsPasswordEqualTo('password')
  passwordConfirm?: string;
}
