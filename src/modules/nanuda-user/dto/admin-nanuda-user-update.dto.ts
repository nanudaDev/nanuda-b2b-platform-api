import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { YN } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { NanudaUser } from '../nanuda-user.entity';

export class AdminNanudaUserUpdateDto extends BaseDto<AdminNanudaUserUpdateDto>
  implements Partial<NanudaUser> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('KR', { message: '올바른 전화번호를 입력해주세요' })
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
