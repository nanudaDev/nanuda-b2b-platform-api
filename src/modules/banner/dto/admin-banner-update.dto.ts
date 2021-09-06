import { BANNER_TYPE, BaseDto, LINK_TYPE } from 'src/core';
import { Banner } from '../banner.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { Default, YN } from 'src/common';

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

  @ApiPropertyOptional({ enum: BANNER_TYPE })
  @IsOptional()
  @Expose()
  @IsEnum(BANNER_TYPE)
  bannerType?: BANNER_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  showYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  delYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ended?: Date;
}
