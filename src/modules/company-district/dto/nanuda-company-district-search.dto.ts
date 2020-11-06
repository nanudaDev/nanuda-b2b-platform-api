import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { BaseDto } from 'src/core';
import { CompanyDistrictListDto } from './company-district.list.dto';

export class NanudaCompanyDistrictSearchDto extends BaseDto<
  NanudaCompanyDistrictSearchDto
> {
  @ApiPropertyOptional({ name: 'amenityIds[]', type: Number, isArray: true })
  @IsOptional()
  @IsArray()
  @Expose()
  amenityIds?: number[];

  @ApiPropertyOptional({ name: 'brandIds[]', type: Number, isArray: true })
  @IsOptional()
  @Expose()
  @IsArray()
  brandIds?: number[];

  @ApiPropertyOptional({
    name: 'deliverySpaceOptionIds[]',
    type: Number,
    isArray: true,
  })
  @IsOptional()
  @Expose()
  @IsArray()
  deliverySpaceOptionIds?: number[];
}
