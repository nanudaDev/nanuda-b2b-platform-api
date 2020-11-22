import { Admin } from '../admin.entity';
import { BaseDto, SPACE_TYPE } from '../../../core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IsPasswordEqualTo } from '../../../common';

export class AdminCreateDto extends BaseDto<AdminCreateDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsPasswordEqualTo('password')
  @Expose()
  passwordConfirm: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  @Expose()
  spaceTypeNo?: SPACE_TYPE;
}
