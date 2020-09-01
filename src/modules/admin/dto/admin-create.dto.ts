import { Admin } from '../admin.entity';
import { BaseDto } from '../../../core';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
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
}
