import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../../core';
import { UPLOAD_TYPE } from '../../../config';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FileUploadPresignedDto extends BaseDto<FileUploadPresignedDto> {
  constructor(partial?: Partial<FileUploadPresignedDto>) {
    super(partial);
  }

  @ApiProperty({ enum: UPLOAD_TYPE })
  @IsEnum(UPLOAD_TYPE)
  @Expose()
  uploadType: UPLOAD_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  filename: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  mimetype: string;
}
