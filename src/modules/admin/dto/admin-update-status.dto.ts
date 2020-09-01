import { BaseDto } from '../../../core';
import { Admin } from '../admin.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ADMIN_USER } from 'src/shared';
import { IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminUpdateStatusDto extends BaseDto<AdminUpdateStatusDto>
  implements Partial<Admin> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiProperty({ enum: ADMIN_USER })
  @IsEnum(ADMIN_USER)
  @Expose()
  authCode?: ADMIN_USER;
}
