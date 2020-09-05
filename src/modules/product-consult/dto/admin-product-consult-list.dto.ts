import { BaseDto } from 'src/core';
import { ProductConsult } from '../product-consult.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminProductConsultListDto
  extends BaseDto<AdminProductConsultListDto>
  implements Partial<ProductConsult> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserNo?: number;
}
