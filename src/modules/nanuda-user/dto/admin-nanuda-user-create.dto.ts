import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { YN } from 'src/common';
import { BaseDto, GENDER } from 'src/core';
import { NanudaUser } from '../nanuda-user.entity';

export class AdminNanudaUserCreateDto extends BaseDto<AdminNanudaUserCreateDto>
  implements Partial<NanudaUser> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요.' })
  phone: string;

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
