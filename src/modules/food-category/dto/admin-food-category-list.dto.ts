import { FoodCategoryListDto } from './food-category-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN } from 'src/common';

export class AdminFoodCategoryListDto extends FoodCategoryListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  code?: string;
}
