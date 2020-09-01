import { BaseDto } from 'src/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsPasswordEqualTo } from 'src/common';

export class CompanyUserPasswordUpdateDto extends BaseDto<
  CompanyUserPasswordUpdateDto
> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsPasswordEqualTo('password')
  passwordConfirm?: string;
}
