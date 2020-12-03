import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { AdminBestSpaceListDto } from './admin-best-space-list.dto';

export class NanudaBestSpaceListDto extends AdminBestSpaceListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;
}
