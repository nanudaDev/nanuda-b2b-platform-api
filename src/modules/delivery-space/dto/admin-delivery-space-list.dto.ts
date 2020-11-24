import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { DeliverySpaceListDto } from './delivery-space-list.dto';
import { YN } from 'src/common';

export class AdminDeliverySpaceListDto extends DeliverySpaceListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  brandName?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  isOpenedYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  isBestedShowYn?: YN;
}
