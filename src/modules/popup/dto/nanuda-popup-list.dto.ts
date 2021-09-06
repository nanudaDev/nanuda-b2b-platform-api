import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto, LINK_TYPE, POPUP } from 'src/core';
import { Popup } from '../popup.entity';

export class NanudaPopupListDto extends BaseDto<NanudaPopupListDto>
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

  @ApiPropertyOptional({ enum: LINK_TYPE })
  @IsOptional()
  @IsEnum(LINK_TYPE)
  @Expose()
  linkType?: LINK_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  link?: string;

  @ApiPropertyOptional({ enum: POPUP })
  @IsOptional()
  @IsEnum(POPUP)
  @Expose()
  popupType?: POPUP;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
