import { BaseDto } from '../../../core';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';
import { IsPhoneNumber, IsNotEmpty, MinLength } from 'class-validator';
import * as errors from 'src/locales/kr/errors.json';

export class CompanyUserLoginDto extends BaseDto<CompanyUserLoginDto>
  implements Partial<CompanyUser> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  @IsNotEmpty({ message: errors.phone.isNotEmpty })
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  password: string;
}
