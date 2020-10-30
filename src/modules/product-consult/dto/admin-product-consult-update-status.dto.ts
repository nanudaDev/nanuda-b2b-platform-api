import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum } from 'class-validator';
import { BaseDto, PRODUCT_CONSULT } from 'src/core';
import { ProductConsult } from '../product-consult.entity';

export class AdminProductConsultUpdateStatusDto
  extends BaseDto<AdminProductConsultUpdateStatusDto>
  implements Partial<ProductConsult> {
  @ApiProperty()
  @IsArray()
  @Expose()
  @ArrayMinSize(1)
  productConsultNos: number[];

  @ApiProperty({ enum: PRODUCT_CONSULT })
  @IsEnum(PRODUCT_CONSULT)
  @Expose()
  status: PRODUCT_CONSULT;
}
