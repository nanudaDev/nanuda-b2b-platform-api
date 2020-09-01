import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UPLOAD_TYPE } from 'src/config';
import { IsEnum } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @Expose()
  file: any;
}

export class FileUploadBodyDto {
  @ApiProperty({ enum: UPLOAD_TYPE })
  @IsEnum(UPLOAD_TYPE)
  @Expose()
  uploadType: UPLOAD_TYPE;
}
