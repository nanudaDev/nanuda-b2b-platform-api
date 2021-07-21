import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { YN } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { NanudaUser } from '../nanuda-user.entity';
import * as errors from 'src/locales/kr/errors.json';

export class AdminNanudaUserUpdateDto extends BaseDto<AdminNanudaUserUpdateDto>
  implements Partial<NanudaUser> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({ enum: GENDER })
  @IsOptional()
  @IsEnum(GENDER)
  @Expose()
  gender?: GENDER;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  marketYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  serviceYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  infoYn?: YN;
}
