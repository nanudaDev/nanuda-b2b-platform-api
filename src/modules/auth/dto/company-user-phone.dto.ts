import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import * as errors from 'src/locales/kr/errors.json';

export class CompanyUserPhoneDto {
  @ApiProperty()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  @IsNotEmpty({ message: errors.phone.isNotEmpty })
  @Expose()
  phone: string;
}
