import { BaseDto } from 'src/core';
import { Article } from '../article.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsUrl,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class AdminArticleCreateDto extends BaseDto<AdminArticleCreateDto>
  implements Partial<Article> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  @Expose()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediaName?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  showYn?: YN;

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
