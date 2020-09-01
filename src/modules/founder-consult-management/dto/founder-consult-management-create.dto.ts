import { BaseDto } from 'src/core';
import { FounderConsultManagement } from '../founder-consult-management.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class FounderConsultManagementCreateDto
  extends BaseDto<FounderConsultManagementCreateDto>
  implements Partial<FounderConsultManagement> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  memo?: string;
}
