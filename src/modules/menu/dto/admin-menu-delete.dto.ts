import { BaseDto } from 'src/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class AdminMenuDeleteDto extends BaseDto<AdminMenuDeleteDto> {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @Expose()
  menuNos?: number[];
}
