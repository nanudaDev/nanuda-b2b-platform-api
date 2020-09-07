import { IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SPACE_TYPE } from 'src/core';

export class FavoriteSpaceMapperCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  nanudaUserNo: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  deliverySpaceNo: number;

  @ApiProperty({ enum: SPACE_TYPE })
  @IsNotEmpty()
  @IsEnum(SPACE_TYPE)
  @Expose()
  spaceType?: SPACE_TYPE;
}
