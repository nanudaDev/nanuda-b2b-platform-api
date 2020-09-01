import { BaseDto, GENDER } from 'src/core';
import { NanudaUser } from '../nanuda-user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class AdminNanudaUserListDto extends BaseDto<AdminNanudaUserListDto>
  implements Partial<NanudaUser> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional({ enum: GENDER })
  @IsOptional()
  @Expose()
  @IsEnum(GENDER)
  gender?: GENDER;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;
}
