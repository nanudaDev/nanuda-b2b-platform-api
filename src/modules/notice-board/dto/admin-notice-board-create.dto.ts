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
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class AdminNoticeBoardCreateDto
  extends BaseDto<AdminNoticeBoardCreateDto>
  implements Partial<NoticeBoard> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  content: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  @Expose()
  url?: string;

  @ApiProperty({ enum: NOTICE_BOARD })
  @IsEnum(NOTICE_BOARD)
  @IsNotEmpty()
  @Expose()
  noticeBoardType: NOTICE_BOARD;

  @ApiPropertyOptional()
  @IsDateString()
  @Expose()
  @IsOptional()
  started: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @Expose()
  @IsOptional()
  ended: Date;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  attachments?: FileAttachmentDto[];
}
