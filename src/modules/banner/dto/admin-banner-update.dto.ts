import { BaseDto, LINK_TYPE } from 'src/core';
import { Banner } from '../banner.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { Default } from 'src/common';

export class AdminBannerUpdateDto extends BaseDto<AdminBannerUpdateDto>
  implements Partial<Banner> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminNo?: number;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @IsArray()
  @Type(() => FileAttachmentDto)
  @Expose()
  @ValidateNested()
  image?: FileAttachmentDto[];

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @IsArray()
  @Type(() => FileAttachmentDto)
  @Expose()
  @ValidateNested()
  mobileImage?: FileAttachmentDto[];

  @ApiPropertyOptional({ enum: LINK_TYPE })
  @IsOptional()
  @IsEnum(LINK_TYPE)
  @Expose()
  @Default(LINK_TYPE.INTERNAL)
  linkType?: LINK_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ended?: Date;
}
