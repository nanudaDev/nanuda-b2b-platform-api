import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsPasswordEqualTo } from 'src/common';
import { BaseDto } from 'src/core';
import { Credential } from '../credential.entity';

export class AdminCredentialCreateDto extends BaseDto<AdminCredentialCreateDto>
  implements Partial<Credential> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPasswordEqualTo('password')
  passwordConfirm: string;
}
