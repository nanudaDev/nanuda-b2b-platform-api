import { DeliverySpaceCreateDto } from './delivery-space-create.dto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { YN, Default } from 'src/common';
import { IsEnum, IsOptional, IsNotEmpty, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class AdminDeliverySpaceCreateDto extends DeliverySpaceCreateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsArray()
  brandIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Default(YN.YES)
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  isBestedYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.YES)
  isOpenedYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  isBestedShowYn?: YN;
}
