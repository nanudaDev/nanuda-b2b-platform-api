import { DeliverySpaceCreateDto } from './delivery-space-create.dto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { YN, Default } from 'src/common';
import { IsEnum, IsOptional, IsNotEmpty, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class AdminDeliverySpaceCreateDto extends DeliverySpaceCreateDto {
  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Default(YN.NO)
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsArray()
  brandIds?: number[];
}
