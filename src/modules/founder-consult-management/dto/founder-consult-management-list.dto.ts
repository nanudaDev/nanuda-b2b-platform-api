import { BaseDto } from 'src/core';
import { FounderConsultManagement } from '../founder-consult-management.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE } from 'src/common';

export class FounderConsultManagementListDto
  extends BaseDto<FounderConsultManagementListDto>
  implements Partial<FounderConsultManagement> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  founderConsultNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyUserNo?: number;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
