import { BaseDto } from 'src/core';
import { Menu } from '../menu.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminMenuUpdateDto extends BaseDto<AdminMenuUpdateDto>
  implements Partial<Menu> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  //TODO: IMAGE
}
