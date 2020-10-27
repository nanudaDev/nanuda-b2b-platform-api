import { Banner } from '../banner.entity';
import { BaseDto, LINK_TYPE } from 'src/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsDate,
  IsUrl,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class AdminBannerCreateDto extends BaseDto<AdminBannerCreateDto>
  implements Partial<Banner> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  showYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsUrl()
  url?: string;

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
