import { BaseDto, SPACE_TYPE } from '../../../core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { Admin } from '../admin.entity';

export class AdminUpdateDto extends BaseDto<AdminUpdateDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsPhoneNumber('KR')
  phone?: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  @IsOptional()
  @Expose()
  spaceTypeNo?: SPACE_TYPE;
}
