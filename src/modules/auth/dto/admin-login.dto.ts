import { BaseDto } from '../../../core';
import { Admin } from '../../../modules/admin';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsPhoneNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class AdminLoginDto extends BaseDto<AdminLoginDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty()
  // throw error for phone's that are not formatted properly
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
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
