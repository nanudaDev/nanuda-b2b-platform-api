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
import { YN, Default } from 'src/common';

export class AdminNoticeBoardUpdateeDto
  extends BaseDto<AdminNoticeBoardUpdateeDto>
  implements Partial<NoticeBoard> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @Expose()
  url?: string;

  @ApiPropertyOptional({ enum: NOTICE_BOARD })
  @IsOptional()
  @IsEnum(NOTICE_BOARD)
  @Expose()
  noticeBoardType?: NOTICE_BOARD;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  @Default(YN.YES)
  tempSaveYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @Expose()
  ended?: Date;
}
