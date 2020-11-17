import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { FileAttachmentDto } from '.';
import { MultiFileUploadClass } from '../multi-file-upload.class';

export class MultiFileUploadCreateDto implements Partial<MultiFileUploadClass> {
  @ApiPropertyOptional({ type: [FileAttachmentDto], isArray: true })
  @IsOptional()
  @Type(() => FileAttachmentDto)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  image?: FileAttachmentDto[];

  @ApiPropertyOptional({ type: [FileAttachmentDto], isArray: true })
  @IsOptional()
  @Type(() => FileAttachmentDto)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  mobileImage: FileAttachmentDto[];
}
