import { BaseDto } from 'src/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { Space } from '../space.entity';
import { SPACE_TYPE } from 'src/shared';
import { ORDER_BY_VALUE, Default, YN } from 'src/common';

export class SpaceListDto extends BaseDto<SpaceListDto>
  implements Partial<Space> {
  constructor(partial?: any) {
    super(partial);
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsOptional()
  @Expose()
  @IsEnum(SPACE_TYPE)
  spaceTypeNo?: SPACE_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sigunguCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderByNo?: ORDER_BY_VALUE;

  //   fixed values
  @Default(YN.YES)
  showYn?: YN;

  @Default(YN.NO)
  delYn?: YN;
}
