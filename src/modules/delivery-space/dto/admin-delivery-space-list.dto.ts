import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { DeliverySpaceListDto } from './delivery-space-list.dto';

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
}
