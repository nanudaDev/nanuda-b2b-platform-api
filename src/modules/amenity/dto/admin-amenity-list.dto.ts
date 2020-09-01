import { AmenityListDto } from './amenity-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ORDER_BY_VALUE, Default } from 'src/common';
import { IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminAmenityListDto extends AmenityListDto {
  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
