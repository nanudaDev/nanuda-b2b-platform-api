import { BaseDto } from '../../../core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
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
  phone?: string;
}
