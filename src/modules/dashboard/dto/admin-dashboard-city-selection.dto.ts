import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminDashboardCitySelectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  spaceCity?: string;
}
