import { BaseDto, GENDER, PRODUCT_CONSULT } from 'src/core';
import { ProductConsult } from '../product-consult.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default, AVAILABLE_TIME, YN } from 'src/common';

export class AdminProductConsultListDto
  extends BaseDto<AdminProductConsultListDto>
  implements Partial<ProductConsult> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nanudaUserName?: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  nanudaUserPhone?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  changUpExpYn?: YN;

  @ApiPropertyOptional({ enum: PRODUCT_CONSULT })
  @IsOptional()
  @Expose()
  @IsEnum(PRODUCT_CONSULT)
  status?: PRODUCT_CONSULT;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  addressCode?: string;

  @ApiPropertyOptional({ enum: GENDER })
  @IsOptional()
  @IsEnum(GENDER)
  @Expose()
  gender?: GENDER;

  @ApiPropertyOptional({ enum: AVAILABLE_TIME })
  @IsOptional()
  @Expose()
  @IsEnum(AVAILABLE_TIME)
  hopeTime?: AVAILABLE_TIME;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  brandNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  brandName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
