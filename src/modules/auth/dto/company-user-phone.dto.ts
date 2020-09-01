import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CompanyUserPhoneDto {
  @ApiProperty()
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  @Expose()
  phone: string;
}
