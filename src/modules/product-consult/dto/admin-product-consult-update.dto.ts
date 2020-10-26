import { BaseDto, GENDER, PRODUCT_CONSULT } from 'src/core';
import { ProductConsult } from '../product-consult.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { AVAILABLE_TIME, YN } from 'src/common';

export class AdminProductConsultUpdateDto extends BaseDto<ProductConsult>
  implements Partial<ProductConsult> {
  @ApiPropertyOptional({ enum: PRODUCT_CONSULT })
  @IsOptional()
  @Expose()
  @IsEnum(PRODUCT_CONSULT)
  status?: PRODUCT_CONSULT;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  pConsultManager?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  pConsultEtc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hopeTime?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  changUpExpYn?: YN;

  @ApiPropertyOptional({ enum: GENDER })
  @IsOptional()
  @IsEnum(GENDER)
  @Expose()
  gender?: GENDER;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  confirmDate?: Date;
}
