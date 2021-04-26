import { BaseDto } from 'src/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsEnum } from 'class-validator';
import { Admin } from '..';
import { ADMIN_USER, SPACE_TYPE } from 'src/shared';
import { Default, ORDER_BY_VALUE, YN } from 'src/common';

export class AdminListDto extends BaseDto<AdminListDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional({ enum: ADMIN_USER })
  @IsOptional()
  @IsEnum(ADMIN_USER)
  @Expose()
  authCode?: ADMIN_USER;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceTypeNo?: 0 | 1 | 2;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  orderByNo?: ORDER_BY_VALUE;
}
