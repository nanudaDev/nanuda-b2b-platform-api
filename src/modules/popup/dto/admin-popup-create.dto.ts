import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto, BaseService, LINK_TYPE, POPUP } from 'src/core';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { Popup } from '../popup.entity';

export class AdminPopupCreateDto extends BaseDto<AdminPopupCreateDto>
  implements Partial<Popup> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  subTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  content?: string;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Expose()
  images?: FileAttachmentDto[];

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  delYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  showYn?: YN;

  @ApiPropertyOptional({ enum: LINK_TYPE })
  @IsOptional()
  @IsEnum(LINK_TYPE)
  @Expose()
  linkType?: LINK_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsUrl()
  link?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  started: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  ended: Date;

  @ApiProperty({ enum: POPUP })
  @IsEnum(POPUP)
  @Expose()
  @Default(POPUP.IMAGE)
  popupType: POPUP;
}
