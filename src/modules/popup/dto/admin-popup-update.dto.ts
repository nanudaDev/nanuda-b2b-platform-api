import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto, LINK_TYPE, POPUP } from 'src/core';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { Popup } from '../popup.entity';

export class AdminPopupUpdateDto extends BaseDto<AdminPopupUpdateDto>
  implements Partial<Popup> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  subTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  content?: string;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @IsArray()
  @Type(() => FileAttachmentDto)
  @Expose()
  @ValidateNested()
  images?: FileAttachmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ended?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsUrl()
  link?: string;

  @ApiPropertyOptional({ enum: LINK_TYPE })
  @IsOptional()
  @IsEnum(LINK_TYPE)
  @Expose()
  linkType?: LINK_TYPE;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  showYn?: YN;
}
