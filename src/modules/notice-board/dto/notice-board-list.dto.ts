import { BaseDto, NOTICE_BOARD } from 'src/core';
import { NoticeBoard } from '../notice-board.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUrl,
  IsObject,
  IsOptional,
  IsDate,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ORDER_BY_VALUE, Default } from 'src/common';

export class NoticeBoardListDto extends BaseDto<NoticeBoardListDto>
  implements Partial<NoticeBoard> {
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
