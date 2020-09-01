import { BaseDto } from '../../../core';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';
import { IsPhoneNumber, IsNotEmpty, MinLength } from 'class-validator';

export class CompanyUserLoginDto extends BaseDto<CompanyUserLoginDto>
  implements Partial<CompanyUser> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty()
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  password: string;
}
