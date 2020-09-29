import { BaseDto, GENDER, PRODUCT_CONSULT } from 'src/core';
import { ProductConsult } from '../product-consult.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { AVAILABLE_TIME, YN } from 'src/common';

export class AdminProductConsultUpdateDto extends BaseDto<ProductConsult> {
  @ApiPropertyOptional({ enum: PRODUCT_CONSULT })
  @IsOptional()
  @Expose()
  @IsEnum(PRODUCT_CONSULT)
  status?: PRODUCT_CONSULT;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  pConsultManager?: number;

  @ApiPropertyOptional({ enum: AVAILABLE_TIME })
  @IsOptional()
  @IsEnum(AVAILABLE_TIME)
  @Expose()
  hopeTime?: AVAILABLE_TIME;

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
