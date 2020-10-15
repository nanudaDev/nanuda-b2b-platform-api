import { ApiPropertyOptional } from '@nestjs/swagger';
import { Part } from 'aws-sdk/clients/s3';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { Credential } from '../credential.entity';

export class AdminCredentialListDto extends BaseDto<AdminCredentialListDto>
  implements Partial<Credential> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminPhone?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
