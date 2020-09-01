import { BaseDto } from 'src/core';
import { Brand } from '../brand.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { Type } from 'class-transformer';

export class AdminBrandUpdateDto extends BaseDto<AdminBrandUpdateDto>
  implements Partial<Brand> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  showYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  logo?: FileAttachmentDto[];
}
