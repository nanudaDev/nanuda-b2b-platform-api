import { NoticeBoardListDto } from './notice-board-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { NOTICE_BOARD, BaseDto } from 'src/core';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class AdminNoticeBoardListDto extends BaseDto<AdminNoticeBoardListDto> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  url?: string;

  @ApiPropertyOptional({ enum: NOTICE_BOARD })
  @IsOptional()
  @IsEnum(NOTICE_BOARD)
  @Expose()
  noticeBoardType?: NOTICE_BOARD;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
