import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
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
}
