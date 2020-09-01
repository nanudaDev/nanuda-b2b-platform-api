import { NoticeBoardListDto } from './notice-board-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminNoticeBoardListDto extends NoticeBoardListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;
}
