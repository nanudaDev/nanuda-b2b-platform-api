import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SmallBusinessApplicantExperience {
  @ApiPropertyOptional()
  @Expose()
  businessStartDate?: string;
  @ApiPropertyOptional()
  @Expose()
  businessEndDate?: string;
  operationDuration?: string | number;
  @ApiPropertyOptional()
  @Expose()
  businessCloseReason?: string;
  @ApiPropertyOptional()
  @Expose()
  businessLocation?: string;
  hdongCode?: string | number;
  @ApiPropertyOptional()
  @Expose()
  foodCategory?: string;
}
