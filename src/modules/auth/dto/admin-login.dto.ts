import { BaseDto } from '../../../core';
import { Admin } from '../../../modules/admin';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsPhoneNumber, IsNotEmpty, IsOptional } from 'class-validator';
import * as errors from 'src/locales/kr/errors.json';

export class AdminLoginDto extends BaseDto<AdminLoginDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty()
  // throw error for phone's that are not formatted properly
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  @IsNotEmpty({ message: errors.phone.isNotEmpty })
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  rememberMe?: boolean;
}
