import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { Expose } from 'class-transformer';

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
  @IsPhoneNumber('KR', { message: '휴대폰 번호를 정확히 입력해주세요.' })
  phone: string;
}
