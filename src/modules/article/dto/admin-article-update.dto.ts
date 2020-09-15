import { BaseDto } from 'src/core';
import { Article } from '../article.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class AdminArticleUpdateDto extends BaseDto<AdminArticleUpdateDto>
  implements Partial<Article> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @Expose()
  image?: FileAttachmentDto[];
}
