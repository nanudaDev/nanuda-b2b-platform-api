import { BaseDto } from 'src/core';
import { Menu } from '../menu.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, Default } from 'src/common';

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

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  mainYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  showYn?: YN;

  //TODO: IMAGE
}
