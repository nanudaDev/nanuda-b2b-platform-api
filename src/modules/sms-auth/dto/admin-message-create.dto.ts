import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import * as errors from 'src/locales/kr/errors.json';
export class AdminSendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  phone: string;
}
